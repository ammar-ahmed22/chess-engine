import bb from "./bb.png";
import bk from "./bk.png";
import bn from "./bn.png";
import bp from "./bp.png";
import bq from "./bq.png";
import br from "./br.png";
import wb from "./wb.png";
import wk from "./wk.png";
import wn from "./wn.png";
import wp from "./wp.png";
import wq from "./wq.png";
import wr from "./wr.png";

import type { PieceMap } from "..";

export const CasesPieceMap: PieceMap = {
  white: {
    pawn: wp,
    rook: wr,
    knight: wn,
    bishop: wb,
    king: wk,
    queen: wq
  },
  black: {
    pawn: bp,
    rook: br,
    knight: bn,
    bishop: bb,
    king: bk,
    queen: bq
  }
}

