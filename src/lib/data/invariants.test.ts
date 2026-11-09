import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterMatches,
  getMatch,
  getPlayer,
  getPlayers,
  getSnapshot,
  getSource,
  setsWon,
  singlesBracket,
} from "./adapter";
import { r32Ties } from "./matches";

describe("snapshot adapter", () => {
  it("does not pretend to be live", () => {
    const snapshot = getSnapshot();
    const source = getSource();
    assert.equal(snapshot.live, false);
    assert.equal(source.live, false);
    assert.equal(snapshot.fetchedOn, "2026-11-09");
    assert.equal(snapshot.timezone, "Europe/Stockholm");
  });

  it("keeps scores aligned with winners and never invents a live status", () => {
    for (const match of getSource().matches) {
      assert.ok(["completed", "scheduled", "pending"].includes(match.status));
      if (match.status === "completed") {
        assert.ok(match.score);
        assert.ok(match.winner === 0 || match.winner === 1);
        assert.ok(setsWon(match.score!, match.winner!) > setsWon(match.score!, match.winner! === 0 ? 1 : 0));
        for (const set of match.score!.sets) {
          assert.notEqual(set.games[0], set.games[1]);
          if (set.tiebreak !== undefined) {
            assert.ok(
              (set.games[0] === 7 && set.games[1] === 6) ||
                (set.games[0] === 6 && set.games[1] === 7),
            );
          }
        }
      } else {
        assert.equal(match.score, undefined);
        assert.equal(match.winner, undefined);
      }
      for (const side of match.sides) {
        for (const member of side.members) {
          if (member.playerId) assert.ok(getPlayer(member.playerId), member.playerId);
        }
      }
    }
  });

  it("uses the published 9 November seeds, not the conflicting Wikipedia seed list", () => {
    assert.equal(getPlayer("taylor-fritz")?.seed, 1);
    assert.equal(getPlayer("casper-ruud")?.seed, 2);
    assert.equal(getPlayer("lorenzo-musetti")?.seed, 3);
    assert.equal(getPlayer("alejandro-tabilo")?.seed, 4);
    assert.equal(getPlayer("tomas-martin-etcheverry")?.seed, 5);
    assert.equal(getPlayer("alex-michelsen")?.seed, 6);
    assert.equal(getPlayer("ugo-humbert")?.seed, 7);
    assert.equal(getPlayer("zizou-bergs")?.seed, 8);
    assert.equal(getPlayer("holger-rune")?.seed, undefined);
  });

  it("builds a 28-player draw and only advances finished matches", () => {
    assert.equal(getPlayers().filter((player) => player.mainDraw).length, 28);
    assert.equal(r32Ties.length, 16);
    const ids = new Set<string>();
    let byes = 0;
    for (const tie of r32Ties) {
      if (tie.a) ids.add(tie.a);
      if (tie.b) ids.add(tie.b);
      if (tie.bye) byes += 1;
    }
    assert.equal(ids.size, 28);
    assert.equal(byes, 4);

    const bracket = singlesBracket();
    const pair = (slot: number) =>
      [bracket.R16[slot].playerA, bracket.R16[slot].playerB].sort();
    assert.deepEqual(pair(0), ["cameron-norrie", "taylor-fritz"]);
    assert.deepEqual(pair(4), ["alex-michelsen", "juan-manuel-cerundolo"]);
    assert.equal(bracket.R16[2].playerA ?? bracket.R16[2].playerB, "lorenzo-musetti");
    assert.equal(bracket.R16[5].playerA ?? bracket.R16[5].playerB, "alejandro-tabilo");
    assert.equal(bracket.R16[7].playerA ?? bracket.R16[7].playerB, "casper-ruud");
    assert.equal(bracket.QF.every((slot) => slot.state === "waiting"), true);
    assert.equal(getPlayer("ugo-humbert") && bracket.R16.some((slot) => slot.playerA === "ugo-humbert" || slot.playerB === "ugo-humbert"), false);
  });

  it("filters without inventing sessions", () => {
    const monday = filterMatches({ date: "2026-11-09", court: "center" });
    assert.ok(monday.every((match) => match.date === "2026-11-09"));
    assert.ok(monday.some((match) => match.id === "m-etcheverry-dahlin"));
    const singlesR16 = filterMatches({ round: "R16", discipline: "singles" });
    assert.equal(singlesR16.length, 0);
    const norrie = getMatch("m-duckworth-norrie");
    assert.equal(norrie?.status, "completed");
    assert.equal(norrie?.winner, 1);
  });

  it("gives every player a Swedish and an English biography", () => {
    for (const player of getPlayers()) {
      assert.ok(player.bio.sv.length > 40, player.id);
      assert.ok(player.bio.en.length > 40, player.id);
    }
  });
});
