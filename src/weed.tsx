import "destyle.css";


export function Weed(canvas: HTMLCanvasElement) {

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ====== DESSIN D'UNE FEUILLE ======

function drawLeafShape() {
  // Cette fonction dessine la feuille à sa taille "origine"
  // dans un repère déjà transformé (translate/scale faits avant).
  ctx.beginPath();
  ctx.moveTo(184, 234);
  ctx.bezierCurveTo(184, 253, 184, 254, 182, 254);
  ctx.bezierCurveTo(182, 254, 182, 254, 182, 254);
  ctx.bezierCurveTo(181, 254, 181, 254, 181, 254);
  ctx.bezierCurveTo(180, 253, 180, 250, 180, 231);
  ctx.bezierCurveTo(180, 223, 179, 216, 179, 216);
  ctx.bezierCurveTo(178, 215, 167, 224, 166, 227);
  ctx.bezierCurveTo(165, 227, 164, 228, 164, 227);
  ctx.bezierCurveTo(163, 227, 162, 228, 161, 229);
  ctx.bezierCurveTo(161, 231, 159, 232, 159, 232);
  ctx.bezierCurveTo(158, 232, 157, 233, 156, 234);
  ctx.bezierCurveTo(155, 236, 153, 237, 153, 237);
  ctx.bezierCurveTo(152, 237, 151, 238, 150, 239);
  ctx.bezierCurveTo(149, 240, 142, 243, 141, 243);
  ctx.bezierCurveTo(140, 243, 139, 244, 137, 245);
  ctx.bezierCurveTo(136, 245, 134, 246, 134, 246);
  ctx.bezierCurveTo(133, 245, 132, 246, 131, 246);
  ctx.bezierCurveTo(129, 247, 126, 248, 120, 248);
  ctx.bezierCurveTo(119, 249, 114, 249, 110, 250);
  ctx.bezierCurveTo(106, 251, 103, 252, 102, 252);
  ctx.bezierCurveTo(102, 252, 104, 250, 106, 248);
  ctx.bezierCurveTo(109, 246, 114, 241, 117, 238);
  ctx.bezierCurveTo(126, 230, 126, 229, 129, 228);
  ctx.bezierCurveTo(130, 227, 132, 226, 132, 225);
  ctx.bezierCurveTo(133, 225, 134, 224, 135, 224);
  ctx.bezierCurveTo(136, 224, 137, 223, 138, 222);
  ctx.bezierCurveTo(138, 222, 139, 221, 141, 221);
  ctx.bezierCurveTo(143, 221, 144, 221, 144, 220);
  ctx.bezierCurveTo(144, 219, 146, 219, 147, 219);
  ctx.bezierCurveTo(149, 219, 151, 219, 151, 218);
  ctx.bezierCurveTo(152, 218, 155, 217, 158, 216);
  ctx.bezierCurveTo(162, 216, 165, 215, 166, 215);
  ctx.bezierCurveTo(166, 215, 169, 214, 171, 213);
  ctx.bezierCurveTo(175, 212, 174, 212, 164, 213);
  ctx.bezierCurveTo(157, 213, 153, 213, 153, 212);
  ctx.bezierCurveTo(154, 211, 154, 211, 151, 212);
  ctx.bezierCurveTo(150, 212, 147, 213, 145, 213);
  ctx.bezierCurveTo(142, 214, 141, 214, 142, 213);
  ctx.bezierCurveTo(142, 211, 142, 211, 138, 213);
  ctx.bezierCurveTo(133, 214, 129, 214, 130, 213);
  ctx.bezierCurveTo(130, 212, 130, 212, 128, 212);
  ctx.bezierCurveTo(125, 214, 117, 214, 117, 213);
  ctx.bezierCurveTo(118, 213, 115, 213, 111, 213);
  ctx.bezierCurveTo(107, 213, 105, 213, 105, 212);
  ctx.bezierCurveTo(106, 211, 105, 211, 102, 211);
  ctx.bezierCurveTo(98, 211, 94, 210, 94, 209);
  ctx.bezierCurveTo(95, 209, 93, 208, 91, 208);
  ctx.bezierCurveTo(85, 207, 84, 206, 84, 205);
  ctx.bezierCurveTo(84, 204, 82, 203, 78, 202);
  ctx.bezierCurveTo(75, 201, 73, 200, 73, 200);
  ctx.bezierCurveTo(73, 199, 70, 198, 67, 196);
  ctx.bezierCurveTo(64, 195, 62, 194, 62, 193);
  ctx.bezierCurveTo(62, 193, 61, 192, 61, 192);
  ctx.bezierCurveTo(60, 192, 53, 189, 46, 186);
  ctx.lineTo(34, 179);
  ctx.lineTo(45, 179);
  ctx.bezierCurveTo(51, 179, 58, 179, 61, 179);
  ctx.bezierCurveTo(64, 179, 65, 179, 65, 178);
  ctx.bezierCurveTo(65, 177, 67, 177, 72, 177);
  ctx.bezierCurveTo(76, 178, 78, 178, 78, 177);
  ctx.bezierCurveTo(77, 176, 80, 176, 85, 177);
  ctx.bezierCurveTo(88, 178, 90, 178, 90, 177);
  ctx.bezierCurveTo(91, 176, 93, 176, 100, 178);
  ctx.bezierCurveTo(102, 178, 102, 178, 102, 177);
  ctx.bezierCurveTo(101, 176, 103, 176, 109, 179);
  ctx.bezierCurveTo(113, 180, 113, 180, 112, 179);
  ctx.bezierCurveTo(111, 177, 115, 178, 119, 181);
  ctx.bezierCurveTo(122, 183, 124, 183, 124, 183);
  ctx.bezierCurveTo(125, 182, 126, 183, 129, 185);
  ctx.bezierCurveTo(132, 186, 135, 188, 135, 187);
  ctx.bezierCurveTo(136, 187, 139, 189, 141, 191);
  ctx.bezierCurveTo(145, 194, 146, 195, 146, 193);
  ctx.bezierCurveTo(146, 192, 147, 192, 151, 195);
  ctx.bezierCurveTo(154, 197, 157, 199, 157, 198);
  ctx.bezierCurveTo(158, 198, 160, 199, 162, 200);
  ctx.bezierCurveTo(167, 204, 176, 208, 177, 208);
  ctx.bezierCurveTo(177, 207, 166, 198, 159, 195);
  ctx.bezierCurveTo(155, 193, 153, 192, 154, 191);
  ctx.bezierCurveTo(154, 191, 155, 190, 155, 190);
  ctx.bezierCurveTo(155, 189, 154, 189, 154, 189);
  ctx.bezierCurveTo(153, 189, 150, 188, 146, 186);
  ctx.bezierCurveTo(142, 184, 141, 183, 142, 182);
  ctx.bezierCurveTo(144, 182, 143, 181, 137, 179);
  ctx.bezierCurveTo(133, 177, 131, 176, 131, 175);
  ctx.bezierCurveTo(131, 174, 129, 173, 126, 171);
  ctx.bezierCurveTo(120, 169, 116, 166, 119, 166);
  ctx.bezierCurveTo(121, 166, 120, 164, 116, 163);
  ctx.bezierCurveTo(110, 160, 107, 157, 109, 156);
  ctx.bezierCurveTo(110, 156, 109, 154, 105, 151);
  ctx.bezierCurveTo(99, 147, 98, 145, 100, 145);
  ctx.bezierCurveTo(101, 145, 99, 143, 97, 140);
  ctx.bezierCurveTo(92, 135, 91, 133, 93, 133);
  ctx.bezierCurveTo(94, 133, 93, 132, 92, 130);
  ctx.bezierCurveTo(90, 129, 88, 126, 87, 124);
  ctx.bezierCurveTo(85, 122, 85, 121, 86, 121);
  ctx.bezierCurveTo(88, 121, 87, 119, 83, 114);
  ctx.bezierCurveTo(80, 110, 79, 107, 80, 107);
  ctx.bezierCurveTo(81, 107, 80, 105, 78, 102);
  ctx.bezierCurveTo(76, 99, 64, 76, 64, 74);
  ctx.bezierCurveTo(64, 74, 65, 74, 66, 75);
  ctx.bezierCurveTo(67, 76, 72, 80, 78, 83);
  ctx.bezierCurveTo(83, 87, 89, 92, 91, 93);
  ctx.bezierCurveTo(93, 95, 94, 96, 94, 95);
  ctx.bezierCurveTo(94, 93, 95, 94, 101, 99);
  ctx.bezierCurveTo(105, 103, 107, 104, 107, 103);
  ctx.bezierCurveTo(108, 102, 109, 103, 113, 107);
  ctx.bezierCurveTo(117, 111, 118, 112, 119, 111);
  ctx.bezierCurveTo(120, 110, 121, 111, 124, 115);
  ctx.bezierCurveTo(128, 120, 132, 123, 130, 120);
  ctx.bezierCurveTo(129, 120, 129, 119, 130, 119);
  ctx.bezierCurveTo(130, 119, 133, 122, 135, 125);
  ctx.bezierCurveTo(137, 129, 139, 131, 139, 130);
  ctx.bezierCurveTo(140, 128, 143, 132, 145, 138);
  ctx.bezierCurveTo(146, 141, 147, 143, 147, 142);
  ctx.bezierCurveTo(148, 140, 149, 141, 151, 148);
  ctx.bezierCurveTo(152, 152, 154, 154, 154, 154);
  ctx.bezierCurveTo(155, 152, 157, 155, 158, 162);
  ctx.bezierCurveTo(159, 167, 159, 168, 160, 167);
  ctx.bezierCurveTo(162, 166, 162, 167, 163, 171);
  ctx.bezierCurveTo(164, 173, 165, 176, 165, 178);
  ctx.bezierCurveTo(165, 180, 165, 180, 167, 180);
  ctx.bezierCurveTo(168, 179, 169, 180, 170, 183);
  ctx.bezierCurveTo(172, 189, 178, 202, 179, 202);
  ctx.bezierCurveTo(180, 201, 177, 189, 174, 181);
  ctx.bezierCurveTo(171, 173, 170, 172, 172, 172);
  ctx.bezierCurveTo(174, 172, 173, 170, 170, 165);
  ctx.bezierCurveTo(167, 158, 166, 155, 168, 156);
  ctx.bezierCurveTo(169, 156, 169, 156, 169, 156);
  ctx.bezierCurveTo(169, 157, 170, 157, 170, 157);
  ctx.bezierCurveTo(170, 156, 169, 155, 167, 150);
  ctx.lineTo(166, 150);
  ctx.bezierCurveTo(163, 142, 162, 140, 165, 141);
  ctx.bezierCurveTo(166, 141, 165, 140, 163, 135);
  ctx.bezierCurveTo(160, 128, 159, 124, 162, 125);
  ctx.bezierCurveTo(162, 125, 162, 125, 162, 126);
  ctx.bezierCurveTo(162, 126, 163, 126, 163, 126);
  ctx.bezierCurveTo(163, 126, 163, 125, 161, 121);
  ctx.bezierCurveTo(161, 121, 161, 120, 161, 120);
  ctx.bezierCurveTo(159, 116, 158, 112, 158, 111);
  ctx.bezierCurveTo(158, 108, 158, 108, 160, 109);
  ctx.bezierCurveTo(161, 110, 161, 110, 161, 109);
  ctx.bezierCurveTo(160, 108, 160, 105, 160, 102);
  ctx.bezierCurveTo(159, 100, 159, 96, 158, 95);
  ctx.bezierCurveTo(158, 93, 158, 93, 160, 93);
  ctx.bezierCurveTo(161, 94, 161, 93, 161, 85);
  ctx.bezierCurveTo(161, 78, 161, 77, 162, 77);
  ctx.bezierCurveTo(164, 78, 164, 77, 164, 73);
  ctx.bezierCurveTo(164, 65, 165, 61, 167, 62);
  ctx.bezierCurveTo(168, 63, 168, 62, 168, 57);
  ctx.bezierCurveTo(170, 47, 170, 45, 172, 45);
  ctx.bezierCurveTo(173, 46, 173, 45, 173, 43);
  ctx.bezierCurveTo(173, 40, 181, 6, 182, 6);
  ctx.bezierCurveTo(183, 6, 190, 35, 191, 41);
  ctx.bezierCurveTo(191, 44, 192, 46, 192, 45);
  ctx.bezierCurveTo(194, 45, 194, 47, 196, 57);
  ctx.bezierCurveTo(196, 62, 197, 63, 197, 62);
  ctx.bezierCurveTo(198, 61, 199, 62, 199, 66);
  ctx.bezierCurveTo(200, 68, 200, 72, 200, 74);
  ctx.bezierCurveTo(200, 77, 200, 78, 202, 77);
  ctx.bezierCurveTo(203, 77, 203, 78, 203, 85);
  ctx.bezierCurveTo(203, 92, 203, 94, 204, 93);
  ctx.bezierCurveTo(205, 93, 205, 94, 205, 99);
  ctx.bezierCurveTo(204, 103, 204, 107, 203, 108);
  ctx.bezierCurveTo(203, 110, 203, 110, 204, 109);
  ctx.bezierCurveTo(206, 108, 206, 108, 206, 110);
  ctx.bezierCurveTo(206, 112, 204, 119, 202, 124);
  ctx.bezierCurveTo(201, 126, 201, 126, 202, 125);
  ctx.bezierCurveTo(205, 124, 204, 128, 201, 135);
  ctx.bezierCurveTo(199, 139, 198, 141, 199, 141);
  ctx.bezierCurveTo(202, 140, 201, 141, 198, 149);
  ctx.bezierCurveTo(193, 157, 193, 157, 196, 156);
  ctx.bezierCurveTo(198, 156, 197, 158, 193, 166);
  ctx.bezierCurveTo(191, 171, 190, 172, 192, 172);
  ctx.bezierCurveTo(193, 172, 193, 175, 190, 180);
  ctx.bezierCurveTo(188, 184, 185, 196, 185, 200);
  ctx.bezierCurveTo(185, 202, 185, 202, 188, 197);
  ctx.bezierCurveTo(190, 194, 192, 189, 193, 185);
  ctx.bezierCurveTo(195, 181, 196, 179, 197, 179);
  ctx.bezierCurveTo(198, 179, 199, 178, 200, 175);
  ctx.bezierCurveTo(201, 167, 202, 166, 204, 167);
  ctx.bezierCurveTo(205, 168, 205, 168, 205, 167);
  ctx.bezierCurveTo(205, 166, 206, 162, 207, 159);
  ctx.bezierCurveTo(208, 155, 209, 153, 210, 154);
  ctx.bezierCurveTo(210, 155, 211, 153, 212, 149);
  ctx.bezierCurveTo(214, 142, 216, 140, 217, 142);
  ctx.bezierCurveTo(217, 143, 218, 142, 219, 139);
  ctx.bezierCurveTo(221, 134, 224, 128, 225, 130);
  ctx.bezierCurveTo(226, 131, 226, 130, 228, 128);
  ctx.bezierCurveTo(231, 121, 233, 119, 234, 120);
  ctx.bezierCurveTo(235, 121, 235, 121, 237, 119);
  ctx.bezierCurveTo(241, 113, 244, 110, 245, 111);
  ctx.bezierCurveTo(246, 112, 247, 111, 251, 107);
  ctx.bezierCurveTo(254, 104, 256, 102, 257, 103);
  ctx.bezierCurveTo(257, 104, 259, 102, 263, 99);
  ctx.bezierCurveTo(269, 94, 270, 93, 270, 95);
  ctx.bezierCurveTo(270, 96, 272, 95, 274, 93);
  ctx.bezierCurveTo(276, 91, 281, 87, 286, 84);
  ctx.bezierCurveTo(290, 81, 295, 78, 296, 77);
  ctx.bezierCurveTo(297, 76, 298, 75, 299, 75);
  ctx.bezierCurveTo(299, 76, 286, 102, 284, 105);
  ctx.bezierCurveTo(282, 107, 282, 107, 283, 107);
  ctx.bezierCurveTo(285, 107, 284, 109, 281, 114);
  ctx.bezierCurveTo(278, 118, 276, 121, 277, 121);
  ctx.bezierCurveTo(279, 121, 278, 123, 274, 128);
  ctx.bezierCurveTo(271, 131, 270, 133, 271, 133);
  ctx.bezierCurveTo(272, 134, 268, 140, 265, 143);
  ctx.bezierCurveTo(264, 144, 263, 145, 264, 145);
  ctx.bezierCurveTo(264, 146, 262, 149, 259, 151);
  ctx.bezierCurveTo(256, 154, 254, 156, 255, 156);
  ctx.bezierCurveTo(257, 157, 253, 160, 247, 163);
  ctx.bezierCurveTo(244, 165, 243, 166, 244, 166);
  ctx.bezierCurveTo(246, 167, 243, 169, 237, 172);
  ctx.bezierCurveTo(235, 173, 233, 174, 233, 174);
  ctx.bezierCurveTo(234, 176, 228, 179, 222, 181);
  ctx.bezierCurveTo(220, 181, 220, 181, 221, 183);
  ctx.bezierCurveTo(222, 184, 221, 184, 217, 186);
  ctx.bezierCurveTo(214, 188, 211, 189, 210, 189);
  ctx.bezierCurveTo(209, 189, 209, 189, 210, 190);
  ctx.bezierCurveTo(211, 192, 210, 193, 203, 196);
  ctx.bezierCurveTo(196, 200, 187, 207, 187, 208);
  ctx.bezierCurveTo(188, 208, 197, 204, 202, 200);
  ctx.bezierCurveTo(204, 199, 206, 198, 207, 198);
  ctx.bezierCurveTo(208, 199, 210, 198, 213, 196);
  ctx.bezierCurveTo(216, 193, 218, 192, 218, 193);
  ctx.bezierCurveTo(218, 194, 220, 193, 223, 191);
  ctx.bezierCurveTo(225, 189, 228, 187, 229, 187);
  ctx.bezierCurveTo(229, 188, 232, 186, 235, 185);
  ctx.bezierCurveTo(238, 183, 239, 182, 240, 183);
  ctx.bezierCurveTo(240, 183, 242, 183, 245, 181);
  ctx.bezierCurveTo(249, 178, 250, 178, 251, 179);
  ctx.bezierCurveTo(252, 180, 252, 180, 254, 179);
  ctx.bezierCurveTo(258, 177, 262, 176, 262, 177);
  ctx.bezierCurveTo(262, 178, 265, 178, 268, 177);
  ctx.bezierCurveTo(272, 176, 273, 176, 274, 177);
  ctx.bezierCurveTo(274, 178, 276, 178, 280, 177);
  ctx.bezierCurveTo(284, 176, 285, 176, 286, 177);
  ctx.bezierCurveTo(286, 178, 288, 178, 293, 177);
  ctx.bezierCurveTo(296, 177, 299, 177, 299, 178);
  ctx.bezierCurveTo(299, 178, 306, 179, 314, 179);
  ctx.bezierCurveTo(322, 179, 329, 179, 329, 179);
  ctx.bezierCurveTo(329, 180, 310, 190, 306, 191);
  ctx.bezierCurveTo(304, 192, 302, 193, 302, 193);
  ctx.bezierCurveTo(302, 194, 299, 196, 296, 197);
  ctx.bezierCurveTo(293, 198, 290, 199, 291, 200);
  ctx.bezierCurveTo(291, 200, 289, 201, 286, 202);
  ctx.bezierCurveTo(282, 203, 280, 204, 280, 205);
  ctx.bezierCurveTo(280, 206, 279, 206, 273, 207);
  ctx.bezierCurveTo(271, 208, 269, 208, 269, 209);
  ctx.bezierCurveTo(270, 210, 267, 211, 262, 211);
  ctx.bezierCurveTo(260, 211, 258, 211, 258, 212);
  ctx.bezierCurveTo(258, 213, 256, 213, 252, 213);
  ctx.bezierCurveTo(248, 213, 246, 213, 246, 213);
  ctx.bezierCurveTo(245, 214, 244, 214, 240, 213);
  ctx.bezierCurveTo(236, 213, 234, 213, 234, 213);
  ctx.bezierCurveTo(233, 214, 232, 214, 229, 213);
  ctx.bezierCurveTo(223, 212, 222, 212, 222, 213);
  ctx.bezierCurveTo(223, 214, 223, 214, 216, 213);
  ctx.bezierCurveTo(213, 212, 210, 211, 210, 212);
  ctx.bezierCurveTo(210, 213, 206, 213, 199, 213);
  ctx.bezierCurveTo(189, 212, 189, 212, 193, 213);
  ctx.bezierCurveTo(195, 214, 198, 215, 199, 215);
  ctx.bezierCurveTo(199, 216, 202, 216, 206, 217);
  ctx.bezierCurveTo(209, 217, 212, 218, 213, 218);
  ctx.bezierCurveTo(213, 219, 214, 219, 216, 219);
  ctx.bezierCurveTo(218, 219, 219, 219, 220, 220);
  ctx.bezierCurveTo(220, 221, 221, 221, 222, 221);
  ctx.bezierCurveTo(224, 221, 225, 222, 226, 223);
  ctx.bezierCurveTo(227, 223, 228, 224, 229, 224);
  ctx.bezierCurveTo(229, 224, 230, 225, 231, 225);
  ctx.bezierCurveTo(232, 226, 234, 227, 235, 228);
  ctx.bezierCurveTo(237, 229, 241, 233, 249, 240);
  ctx.bezierCurveTo(251, 242, 255, 245, 258, 248);
  ctx.bezierCurveTo(263, 253, 263, 253, 253, 250);
  ctx.bezierCurveTo(250, 250, 245, 249, 244, 248);
  ctx.bezierCurveTo(237, 248, 235, 247, 233, 246);
  ctx.bezierCurveTo(232, 245, 231, 245, 230, 246);
  ctx.bezierCurveTo(229, 246, 228, 245, 227, 245);
  ctx.bezierCurveTo(226, 244, 224, 243, 224, 243);
  ctx.bezierCurveTo(223, 243, 221, 243, 220, 242);
  ctx.bezierCurveTo(219, 241, 217, 240, 216, 240);
  ctx.bezierCurveTo(215, 240, 214, 239, 213, 238);
  ctx.bezierCurveTo(213, 237, 212, 236, 211, 236);
  ctx.bezierCurveTo(211, 237, 208, 235, 205, 232);
  ctx.bezierCurveTo(203, 230, 200, 228, 200, 228);
  ctx.bezierCurveTo(199, 228, 198, 227, 197, 225);
  ctx.bezierCurveTo(197, 224, 195, 223, 195, 223);
  ctx.bezierCurveTo(194, 223, 192, 221, 190, 219);
  ctx.bezierCurveTo(188, 217, 186, 215, 185, 215);
  ctx.bezierCurveTo(184, 215, 184, 220, 184, 234);
  ctx.closePath();
  ctx.fill();
} 

// cx, cy : centre de la feuille dans le canvas
// size : hauteur approximative souhaitée
function drawLeaf(cx: number, cy: number, size: number) {
  const baseHeight = 250;          // hauteur approx. du dessin original
  const scale = size / baseHeight; // facteur d’échelle

  ctx.save();
  ctx.fillStyle = "rgb(9,148,67)";

  // On place le "centre visuel" de la feuille autour de (cx, cy)
  const baseCenterX = 184;
  const baseCenterY = 130; // milieu approx. vertical entre 6 et 254

  ctx.translate(cx - baseCenterX * scale, cy - baseCenterY * scale);
  ctx.scale(scale, scale);

  drawLeafShape();
  ctx.restore();
}

// === TYPE D'UNE LEAF ANIMÉE ===
interface Leaf {
  x: number;
  y: number;
  size: number;  // taille de la feuille (hauteur approx)
  speed: number;
}

const leaves: Leaf[] = [];

// créer N feuilles
function createLeaves(count: number) {
  for (let i = 0; i < count; i++) {
    leaves.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: 40 + Math.random() * 40,    // hauteur entre ~40 et 80 px
      speed: 1 + Math.random() * 10
    });
  }
}

createLeaves(50 ); // 🌿 nombre de feuilles

// === BOUCLE D'ANIMATION ===
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fond noir
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const f of leaves) {
    drawLeaf(f.x, f.y, f.size);

    // chute
    f.y += f.speed;

    // remis en haut
    if (f.y > canvas.height + f.size) {
      f.y = -f.size;
      f.x = Math.random() * canvas.width;
    }
  }

  requestAnimationFrame(loop);
}

loop();

}
