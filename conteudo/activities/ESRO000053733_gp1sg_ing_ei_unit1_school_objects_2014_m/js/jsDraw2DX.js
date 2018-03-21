/*****************************************************************************************
 *
 * Project Name:		jsDraw2DX (SVG/VML based Graphics Library for JavaScript, HTML5 Ready)
 * Version:		Alpha 1.0.5 (20-July-2012) (Compressed)
 * Project Homepage:	http://jsdraw2dx.jsfiction.com
 * Author:			Sameer Burle
 * Copyright 2012:		jsFiction.com (http://www.jsfiction.com)
 * Licensed Under:		LGPL
 *
 * This program (library) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *****************************************************************************************/
function jsDraw2DX() {
}
jsDraw2DX._RefID = 0;
jsDraw2DX._isVML = false;
jsDraw2DX.checkIE = function() {
	if (navigator.appName == "Microsoft Internet Explorer") {
		var a = 9;
		if (navigator.appVersion.indexOf("MSIE") != -1) {
			a = parseFloat(navigator.appVersion.split("MSIE")[1])
		}
		if (a < 9) {
			jsDraw2DX._isVML = true
		}
	}
};
jsDraw2DX.fact = function(c) {
	var b = 1;
	for (var a = 1; a <= c; a++) {
		b = b * a
	}
	return b
};
jsDraw2DX.init = function() {
	jsDraw2DX.checkIE();
	if (jsDraw2DX._isVML) {
		document.namespaces.add("v", "urn:schemas-microsoft-com:vml", "#default#VML");
		var c = ["fill", "stroke", "path", "textpath"];
		for (var b = 0, a = c.length; b < a; b++) {
			document.createStyleSheet().addRule("v\\:" + c[b], "behavior: url(#default#VML);")
		}
	}
};
jsDraw2DX.init();
function jxGraphics(r) {
	this.origin = new jxPoint(0, 0);
	this.scale = 1;
	this.coordinateSystem = "default";
	var a = new Array();
	var m, p, e, n;
	if (r) {
		m = r;
		m.style.overflow = "hidden"
	} else {
		m = document.body
	}
	if (!jsDraw2DX._isVML) {
		p = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		m.appendChild(p);
		n = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		p.appendChild(n);
		p.style.position = "absolute";
		p.style.top = "0px";
		p.style.left = "0px";
		p.style.width = m.style.width;
		p.style.height = m.style.height
	} else {
		e = document.createElement("v:group");
		e.style.position = "absolute";
		e.style.top = "0px";
		e.style.left = "0px";
		m.appendChild(e)
	}
	this.getDefs = l;
	function l() {
		return n
	}
	this.addShape = b;
	function b(v) {
		var w = this.indexOfShape(v);
		if (w < 0) {
			a.push(v)
		}
	}
	this.removeShape = d;
	function d(v) {
		var w = this.indexOfShape(v);
		if (w >= 0) {
			a.splice(w, 1)
		}
	}
	this.getType = o;
	function o() {
		return "jxGraphics"
	}
	this.getDiv = c;
	function c() {
		return m
	}
	this.getSVG = s;
	function s() {
		return p
	}
	this.getVML = g;
	function g() {
		return e
	}
	this.logicalToPhysicalPoint = j;
	function j(v) {
		if (this.coordinateSystem.toLowerCase() == "cartecian") {
			return new jxPoint(Math.round(v.x * this.scale + this.origin.x), Math.round(this.origin.y - v.y * this.scale))
		} else {
			return new jxPoint(Math.round(v.x * this.scale + this.origin.x), Math.round(v.y * this.scale + this.origin.y))
		}
	}
	this.draw = h;
	function h(v) {
		return v.draw(this)
	}
	this.remove = u;
	function u(v) {
		return v.remove(this)
	}
	this.redrawAll = q;
	function q() {
		for (ind in a) {
			a[ind].draw(this)
		}
	}
	this.getShapesCount = t;
	function t() {
		return a.length
	}
	this.getShape = k;
	function k(v) {
		return a(v)
	}
	this.indexOfShape = f;
	function f(v) {
		var A = -1, z = a.length;
		for (var w = 0; w < z; w++) {
			if (v == a[w]) {
				A = w
			}
		}
		return A
	}

}

function jxColor() {
	var e = "#000000";
	switch(arguments.length) {
		case 1:
			e = arguments[0];
			break;
		case 3:
			var d = arguments[0];
			var c = arguments[1];
			var a = arguments[2];
			e = jxColor.rgbToHex(d, c, a);
			break
	}
	this.getType = f;
	function f() {
		return "jxColor"
	}
	this.getValue = b;
	function b() {
		return e
	}

}
jxColor.rgbToHex = function(a, c, b) {
	if (a < 0 || a > 255 || c < 0 || c > 255 || b < 0 || b > 255) {
		return false
	}
	var d = Math.round(b) + 256 * Math.round(c) + 65536 * Math.round(a);
	return "#" + e(d.toString(16), 6);
	function e(h, f) {
		var g = h + "";
		while (g.length < f) {
			g = "0" + g
		}
		return g
	}

};
jxColor.hexToRgb = function(d) {
	var a, c, b;
	if (d.charAt(0) == "#") {
		d = d.substring(1, 7)
	}
	a = parseInt(d.substring(0, 2), 16);
	c = parseInt(d.substring(2, 4), 16);
	b = parseInt(d.substring(4, 6), 16);
	if (a < 0 || a > 255 || c < 0 || c > 255 || b < 0 || b > 255) {
		return false
	}
	return new Array(a, c, b)
};
function jxFont(e, b, d, g, a) {
	this.family = null;
	this.size = null;
	this.style = null;
	this.weight = null;
	this.variant = null;
	if (e) {
		this.family = e
	}
	if (g) {
		this.weight = g
	}
	if (b) {
		this.size = b
	}
	if (d) {
		this.style = d
	}
	if (a) {
		this.variant = a
	}
	this.updateSVG = f;
	function f(j) {
		if (this.family) {
			j.setAttribute("font-family", this.family)
		} else {
			j.setAttribute("font-family", "")
		}
		if (this.weight) {
			j.setAttribute("font-weight", this.weight)
		} else {
			j.setAttribute("font-weight", "")
		}
		if (this.size) {
			j.setAttribute("font-size", this.size)
		} else {
			j.setAttribute("font-size", "")
		}
		if (this.style) {
			j.setAttribute("font-style", this.style)
		} else {
			j.setAttribute("font-style", "")
		}
		if (this.variant) {
			j.setAttribute("font-variant", this.variant)
		} else {
			j.setAttribute("font-variant", "")
		}
	}
	this.updateVML = c;
	function c(j) {
		if (this.family) {
			j.style.fontFamily = "'" + this.family + "'"
		} else {
			j.style.fontFamily = ""
		}
		if (this.weight) {
			j.style.fontWeight = this.weight
		} else {
			j.style.fontWeight = ""
		}
		if (this.size) {
			j.style.fontSize = this.size
		} else {
			j.style.fontSize = ""
		}
		if (this.style) {
			j.style.fontStyle = this.style
		} else {
			j.style.fontStyle = ""
		}
		if (this.variant) {
			j.style.fontVariant = this.variant
		} else {
			j.style.fontVariant = ""
		}
	}
	this.getType = h;
	function h() {
		return "jxFont"
	}

}
jxFont.updateSVG = function(a) {
	a.setAttribute("font-family", "");
	a.setAttribute("font-weight", "");
	a.setAttribute("font-size", "");
	a.setAttribute("font-style", "");
	a.setAttribute("font-variant", "")
};
jxFont.updateVML = function(a) {
	a.style.fontFamily = "";
	a.style.fontWeight = "";
	a.style.fontSize = "";
	a.style.fontStyle = "";
	a.style.fontVariant = ""
};
function jxPen(a, c, e) {
	this.color = null;
	this.width = null;
	this.dashStyle = null;
	if (a) {
		this.color = a
	} else {
		this.color = new jxColor("#000000")
	}
	if (c) {
		this.width = c
	} else {
		this.width = "1px"
	}
	if (e) {
		this.dashStyle = e
	}
	this.updateSVG = d;
	function d(h) {
		h.setAttribute("stroke", this.color.getValue());
		h.setAttribute("stroke-width", this.width);
		if (this.dashStyle) {
			var g = parseInt(this.width);
			switch(this.dashStyle) {
				case"ShortDash":
					h.setAttribute("stroke-dasharray", g * 3 + " " + g);
					break;
				case"ShortDot":
					h.setAttribute("stroke-dasharray", g + " " + g);
					break;
				case"ShortDashDot":
					h.setAttribute("stroke-dasharray", g * 3 + " " + g + " " + g + " " + g);
					break;
				case"ShortDashDotDot":
					h.setAttribute("stroke-dasharray", g * 3 + " " + g + " " + g + " " + g + " " + g + " " + g);
					break;
				case"Dot":
					h.setAttribute("stroke-dasharray", g + " " + g * 3);
					break;
				case"Dash":
					h.setAttribute("stroke-dasharray", g * 4 + " " + g * 3);
					break;
				case"LongDash":
					h.setAttribute("stroke-dasharray", g * 8 + " " + g * 3);
					break;
				case"DashDot":
					h.setAttribute("stroke-dasharray", g * 4 + " " + g * 3 + " " + g + " " + g * 3);
					break;
				case"LongDashDot":
					h.setAttribute("stroke-dasharray", g * 8 + " " + g * 3 + " " + g + " " + g * 3);
					break;
				case"LongDashDotDot":
					h.setAttribute("stroke-dasharray", g * 8 + " " + g * 3 + " " + g + " " + g * 3 + " " + g + " " + g * 3);
					break;
				default:
					h.setAttribute("stroke-dasharray", this.dashStyle);
					break
			}
		}
	}
	this.updateVML = b;
	function b(g) {
		g.Stroke.JoinStyle = "miter";
		g.Stroke.MiterLimit = "5";
		g.StrokeColor = this.color.getValue();
		g.StrokeWeight = this.width;
		if (this.dashStyle) {
			g.Stroke.DashStyle = this.dashStyle
		}
		if (parseInt(this.width) == 0) {
			g.Stroked = "False"
		}
	}
	this.getType = f;
	function f() {
		return "jxPen"
	}

}

function jxBrush(a, e) {
	this.color = null;
	this.fillType = null;
	this.color2 = null;
	this.angle = null;
	if (a) {
		this.color = a
	} else {
		this.color = new jxColor("#000000")
	}
	if (e) {
		this.fillType = e
	} else {
		this.fillType = "solid"
	}
	this.color2 = new jxColor("#FFFFFF");
	this.updateSVG = c;
	function c(h, f) {
		var m = null, l;
		m = h.getAttribute("fill");
		if (m) {
			if (m.substr(0, 5) == "url(#") {
				m = m.substr(5, m.length - 6);
				l = document.getElementById(m)
			} else {
				m = null
			}
		}
		if (this.fillType == "linear-gradient" || this.fillType == "lin-grad") {
			var g = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
			if (m) {
				f.replaceChild(g, l)
			} else {
				f.appendChild(g)
			}
			var k = document.createElementNS("http://www.w3.org/2000/svg", "stop");
			g.appendChild(k);
			var j = document.createElementNS("http://www.w3.org/2000/svg", "stop");
			g.appendChild(j);
			jsDraw2DX._RefID++;
			g.setAttribute("id", "jsDraw2DX_RefID_" + jsDraw2DX._RefID);
			if (this.angle != null) {
				g.setAttribute("gradientTransform", "rotate(" + this.angle + " 0.5 0.5)")
			} else {
				g.setAttribute("gradientTransform", "rotate(0 0.5 0.5)")
			}
			k.setAttribute("offset", "0%");
			k.setAttribute("style", "stop-color:" + this.color.getValue() + ";stop-opacity:1");
			j.setAttribute("offset", "100%");
			j.setAttribute("style", "stop-color:" + this.color2.getValue() + ";stop-opacity:1");
			g.appendChild(k);
			g.appendChild(j);
			h.setAttribute("fill", "url(#jsDraw2DX_RefID_" + jsDraw2DX._RefID + ")")
		} else {
			h.setAttribute("fill", this.color.getValue())
		}
	}
	this.updateVML = b;
	function b(f) {
		f.On = "true";
		if (this.fillType == "solid") {
			f.Type = "solid";
			f.Color = this.color.getValue();
			f.Color2 = "";
			f.Angle = 270
		} else {
			f.Type = "gradient";
			if (this.angle != null) {
				f.Angle = 270 - this.angle
			} else {
				f.Angle = 270
			}
			f.Color = this.color.getValue();
			f.Color2 = this.color2.getValue()
		}
	}
	this.getType = d;
	function d() {
		return "jxBrush"
	}

}

function jxPoint(a, c) {
	this.x = a;
	this.y = c;
	this.getType = b;
	function b() {
		return "jxPoint"
	}

}

function jxLine(a, h, d) {
	this.fromPoint = a;
	this.toPoint = h;
	this.pen = null;
	var f, g = true;
	var m;
	if (d) {
		this.pen = d
	}
	if (!jsDraw2DX._isVML) {
		f = document.createElementNS("http://www.w3.org/2000/svg", "line")
	} else {
		f = document.createElement("v:line")
	}
	this.getType = j;
	function j() {
		return "jxLine"
	}
	this.addEventListener = b;
	function b(o, p) {
		if (f.addEventListener) {
			f.addEventListener(o, q, false)
		} else {
			if (f.attachEvent) {
				f.attachEvent("on" + o, q)
			}
		}
		var n = this;
		function q(r) {
			p(r, n)
		}

	}
	this.draw = k;
	function k(z) {
		var o, v;
		o = z.logicalToPhysicalPoint(this.fromPoint);
		v = z.logicalToPhysicalPoint(this.toPoint);
		var q, t, s = false;
		q = this.pen.color.getValue();
		t = this.pen.width;
		var r, A, p, w;
		r = o.x;
		A = o.y;
		p = v.x;
		w = v.y;
		f.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var u = z.getSVG();
			if (g) {
				u.appendChild(f);
				g = false
			}
			if (!this.pen) {
				f.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(f)
			}
			f.setAttribute("x1", r);
			f.setAttribute("y1", A);
			f.setAttribute("x2", p);
			f.setAttribute("y2", w)
		} else {
			var n = z.getVML();
			if (g) {
				n.appendChild(f);
				g = false
			}
			if (!this.pen) {
				f.Stroked = "False"
			} else {
				this.pen.updateVML(f)
			}
			f.style.position = "absolute";
			f.From = r + "," + A;
			f.To = p + "," + w;
		}
		f.style.display = "";
		if (m && z != m) {
			m.removeShape(this)
		}
		m = z;
		m.addShape(this)
	}
	this.remove = c;
	function c() {
		if (m) {
			if (!jsDraw2DX._isVML) {
				var o = m.getSVG();
				o.removeChild(f)
			} else {
				var n = m.getVML();
				n.removeChild(f)
			}
			m.removeShape(this);
			m = null;
			g = true
		}
	}
	this.show = l;
	function l() {
		f.style.display = ""
	}
	this.hide = e;
	function e() {
		f.style.display = "none"
	}

}

function jxRect(n, a, o, d, h) {
	this.point = n;
	this.width = a;
	this.height = o;
	this.pen = null;
	this.brush = null;
	var f, g = true;
	var m;
	if (d) {
		this.pen = d
	}
	if (h) {
		this.brush = h
	}
	if (!jsDraw2DX._isVML) {
		f = document.createElementNS("http://www.w3.org/2000/svg", "rect")
	} else {
		f = document.createElement("v:rect")
	}
	this.getType = j;
	function j() {
		return "jxRect"
	}
	this.addEventListener = b;
	function b(q, r) {
		if (f.addEventListener) {
			f.addEventListener(q, s, false)
		} else {
			if (f.attachEvent) {
				f.attachEvent("on" + q, s)
			}
		}
		var p = this;
		function s(t) {
			r(t, p)
		}

	}
	this.draw = k;
	function k(t) {
		var r, w;
		r = t.logicalToPhysicalPoint(this.point);
		w = t.scale;
		var u, v;
		u = r.x;
		v = r.y;
		f.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var s = t.getSVG();
			if (g) {
				s.appendChild(f);
				g = false
			}
			if (!this.pen) {
				f.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(f)
			}
			if (!this.brush) {
				f.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(f, t.getDefs())
			}
			f.setAttribute("x", u);
			f.setAttribute("y", v);
			f.setAttribute("width", w * this.width);
			f.setAttribute("height", w * this.height);
			f.style.position = "absolute"
		} else {
			var q = t.getVML(), p;
			if (g) {
				q.appendChild(f);
				g = false
			}
			if (!this.pen) {
				f.Stroked = "False"
			} else {
				this.pen.updateVML(f)
			}
			p = f.fill;
			if (!this.brush) {
				p.On = "false"
			} else {
				this.brush.updateVML(p)
			}
			f.style.width = w * this.width;
			f.style.height = w * this.height;
			f.style.position = "absolute";
			f.style.top = v;
			f.style.left = u
		}
		f.style.display = "";
		if (m && t != m) {
			m.removeShape(this)
		}
		m = t;
		m.addShape(this)
	}
	this.remove = c;
	function c() {
		if (m) {
			if (!jsDraw2DX._isVML) {
				var q = m.getSVG();
				q.removeChild(f)
			} else {
				var p = m.getVML();
				p.removeChild(f)
			}
			m.removeShape(this);
			m = null;
			g = true
		}
	}
	this.show = l;
	function l() {
		f.style.display = ""
	}
	this.hide = e;
	function e() {
		f.style.display = "none"
	}

}

function jxPolyline(m, c, g) {
	this.points = m;
	this.pen = null;
	this.brush = null;
	var e, f = true;
	var l;
	if (c) {
		this.pen = c
	}
	if (g) {
		this.brush = g
	}
	if (!jsDraw2DX._isVML) {
		e = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
	} else {
		e = document.createElement("v:polyline")
	}
	this.getType = h;
	function h() {
		return "jxPolyline"
	}
	this.addEventListener = a;
	function a(o, p) {
		if (e.addEventListener) {
			e.addEventListener(o, q, false)
		} else {
			if (e.attachEvent) {
				e.attachEvent("on" + o, q)
			}
		}
		var n = this;
		function q(r) {
			p(r, n)
		}

	}
	this.draw = j;
	function j(q) {
		var r = new Array(), s = "";
		for (ind in this.points) {
			r[ind] = q.logicalToPhysicalPoint(this.points[ind])
		}
		for (ind in r) {
			s = s + r[ind].x + "," + r[ind].y + " "
		}
		e.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var p = q.getSVG();
			if (f) {
				p.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(e)
			}
			if (!this.brush) {
				e.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(e, q.getDefs())
			}
			e.style.position = "absolute";
			e.setAttribute("points", s)
		} else {
			var o = q.getVML(), n;
			if (f) {
				o.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.Stroked = "False"
			} else {
				this.pen.updateVML(e)
			}
			n = e.fill;
			if (!this.brush) {
				n.On = "false"
			} else {
				this.brush.updateVML(n)
			}
			e.style.position = "absolute";
			e.Points.Value = s
		}
		e.style.display = "";
		if (l && q != l) {
			l.removeShape(this)
		}
		l = q;
		l.addShape(this)
	}
	this.remove = b;
	function b() {
		if (l) {
			if (!jsDraw2DX._isVML) {
				var o = l.getSVG();
				o.removeChild(e)
			} else {
				var n = l.getVML();
				n.removeChild(e)
			}
			l.removeShape(this);
			l = null;
			f = true
		}
	}
	this.show = k;
	function k() {
		e.style.display = ""
	}
	this.hide = d;
	function d() {
		e.style.display = "none"
	}

}

function jxPolygon(m, c, g) {
	this.points = m;
	this.pen = null;
	this.brush = null;
	var e, f = true;
	var l;
	if (c) {
		this.pen = c
	}
	if (g) {
		this.brush = g
	}
	if (!jsDraw2DX._isVML) {
		e = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
	} else {
		e = document.createElement("v:polyline")
	}
	this.getType = h;
	function h() {
		return "jxPolygon"
	}
	this.addEventListener = a;
	function a(o, p) {
		if (e.addEventListener) {
			e.addEventListener(o, q, false)
		} else {
			if (e.attachEvent) {
				e.attachEvent("on" + o, q)
			}
		}
		var n = this;
		function q(r) {
			p(r, n)
		}

	}
	this.draw = j;
	function j(q) {
		var r = new Array(), s = "";
		for (ind in this.points) {
			r[ind] = q.logicalToPhysicalPoint(this.points[ind])
		}
		for (ind in r) {
			s = s + r[ind].x + "," + r[ind].y + " "
		}
		e.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var p = q.getSVG();
			if (f) {
				p.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(e)
			}
			if (!this.brush) {
				e.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(e, q.getDefs())
			}
			e.style.position = "absolute";
			e.setAttribute("points", s)
		} else {
			s = s + r[0].x + "," + r[0].y;
			var o = q.getVML(), n;
			if (f) {
				o.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.Stroked = "False"
			} else {
				this.pen.updateVML(e)
			}
			n = e.fill;
			if (!this.brush) {
				n.On = "false"
			} else {
				this.brush.updateVML(n)
			}
			e.style.position = "absolute";
			e.Points.Value = s
		}
		e.style.display = "";
		if (l && q != l) {
			l.removeShape(this)
		}
		l = q;
		l.addShape(this)
	}
	this.remove = b;
	function b() {
		if (l) {
			if (!jsDraw2DX._isVML) {
				var o = l.getSVG();
				o.removeChild(e)
			} else {
				var n = l.getVML();
				n.removeChild(e)
			}
			l.removeShape(this);
			l = null;
			f = true
		}
	}
	this.show = k;
	function k() {
		e.style.display = ""
	}
	this.hide = d;
	function d() {
		e.style.display = "none"
	}

}

function jxCircle(a, h, d, j) {
	this.center = a;
	this.radius = h;
	this.pen = null;
	this.brush = null;
	var f, g = true;
	var n;
	if (d) {
		this.pen = d
	}
	if (j) {
		this.brush = j
	}
	if (!jsDraw2DX._isVML) {
		f = document.createElementNS("http://www.w3.org/2000/svg", "circle")
	} else {
		f = document.createElement("v:oval")
	}
	this.getType = k;
	function k() {
		return "jxCircle"
	}
	this.addEventListener = b;
	function b(p, q) {
		if (f.addEventListener) {
			f.addEventListener(p, r, false)
		} else {
			if (f.attachEvent) {
				f.attachEvent("on" + p, r)
			}
		}
		var o = this;
		function r(s) {
			q(s, o)
		}

	}
	this.draw = l;
	function l(t) {
		var r, u;
		r = t.logicalToPhysicalPoint(this.center);
		u = t.scale;
		var q, v;
		q = r.x;
		v = r.y;
		f.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var s = t.getSVG();
			if (g) {
				s.appendChild(f);
				g = false
			}
			if (!this.pen) {
				f.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(f)
			}
			if (!this.brush) {
				f.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(f, t.getDefs())
			}
			f.setAttribute("cx", q);
			f.setAttribute("cy", v);
			f.setAttribute("r", u * this.radius);
			f.style.position = "absolute"
		} else {
			var p = t.getVML(), o;
			if (g) {
				p.appendChild(f);
				g = false
			}
			if (!this.pen) {
				f.Stroked = "False"
			} else {
				this.pen.updateVML(f)
			}
			o = f.fill;
			if (!this.brush) {
				o.On = "false"
			} else {
				this.brush.updateVML(o)
			}
			f.style.width = u * this.radius * 2;
			f.style.height = u * this.radius * 2;
			f.style.position = "absolute";
			f.style.top = v - this.radius;
			f.style.left = q - this.radius
		}
		f.style.display = "";
		if (n && t != n) {
			n.removeShape(this)
		}
		n = t;
		n.addShape(this)
	}
	this.remove = c;
	function c() {
		if (n) {
			if (!jsDraw2DX._isVML) {
				var p = n.getSVG();
				p.removeChild(f)
			} else {
				var o = n.getVML();
				o.removeChild(f)
			}
			n.removeShape(this);
			n = null;
			g = true
		}
	}
	this.show = m;
	function m() {
		f.style.display = ""
	}
	this.hide = e;
	function e() {
		f.style.display = "none"
	}

}

function jxEllipse(a, b, o, e, j) {
	this.center = a;
	this.width = b;
	this.height = o;
	this.pen = null;
	this.brush = null;
	var g, h = true;
	var n;
	if (e) {
		this.pen = e
	}
	if (j) {
		this.brush = j
	}
	if (!jsDraw2DX._isVML) {
		g = document.createElementNS("http://www.w3.org/2000/svg", "ellipse")
	} else {
		g = document.createElement("v:oval")
	}
	this.getType = k;
	function k() {
		return "jxEllipse"
	}
	this.addEventListener = c;
	function c(q, r) {
		if (g.addEventListener) {
			g.addEventListener(q, s, false)
		} else {
			if (g.attachEvent) {
				g.attachEvent("on" + q, s)
			}
		}
		var p = this;
		function s(t) {
			r(t, p)
		}

	}
	this.draw = l;
	function l(u) {
		var s, v;
		s = u.logicalToPhysicalPoint(this.center);
		v = u.scale;
		var r, w;
		r = s.x;
		w = s.y;
		g.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var t = u.getSVG();
			if (h) {
				t.appendChild(g);
				h = false
			}
			if (!this.pen) {
				g.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(g)
			}
			if (!this.brush) {
				g.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(g, u.getDefs())
			}
			g.setAttribute("cx", r);
			g.setAttribute("cy", w);
			g.setAttribute("rx", v * this.width / 2);
			g.setAttribute("ry", v * this.height / 2);
			g.style.position = "absolute"
		} else {
			var q = u.getVML(), p;
			if (h) {
				q.appendChild(g);
				h = false
			}
			if (!this.pen) {
				g.Stroked = "False"
			} else {
				this.pen.updateVML(g)
			}
			p = g.fill;
			if (!this.brush) {
				p.On = "false"
			} else {
				this.brush.updateVML(p)
			}
			g.style.width = v * this.width;
			g.style.height = v * this.height;
			g.style.position = "absolute";
			g.style.top = w - v * this.height / 2;
			g.style.left = r - v * this.width / 2
		}
		g.style.display = "";
		if (n && u != n) {
			n.removeShape(this)
		}
		n = u;
		n.addShape(this)
	}
	this.remove = d;
	function d() {
		if (n) {
			if (!jsDraw2DX._isVML) {
				var q = n.getSVG();
				q.removeChild(g)
			} else {
				var p = n.getVML();
				p.removeChild(g)
			}
			n.removeShape(this);
			n = null;
			h = true
		}
	}
	this.show = m;
	function m() {
		g.style.display = ""
	}
	this.hide = f;
	function f() {
		g.style.display = "none"
	}

}

function jxArc(a, b, p, j, q, e, k) {
	this.center = a;
	this.width = b;
	this.height = p;
	this.startAngle = j;
	this.arcAngle = q;
	this.pen = null;
	this.brush = null;
	var g, h = true;
	var o;
	if (e) {
		this.pen = e
	}
	if (k) {
		this.brush = k
	}
	if (!jsDraw2DX._isVML) {
		g = document.createElementNS("http://www.w3.org/2000/svg", "path")
	} else {
		g = document.createElement("v:arc")
	}
	this.getType = l;
	function l() {
		return "jxArc"
	}
	this.addEventListener = c;
	function c(s, t) {
		if (g.addEventListener) {
			g.addEventListener(s, u, false)
		} else {
			if (g.attachEvent) {
				g.attachEvent("on" + s, u)
			}
		}
		var r = this;
		function u(v) {
			t(v, r)
		}

	}
	this.draw = m;
	function m(I) {
		var L, N;
		L = I.logicalToPhysicalPoint(I);
		N = I.scale;
		var w, u;
		w = this.center.x;
		u = this.center.y;
		g.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var M, K, F, E, H, G, v, t, r, A;
			M = N * this.width / 2;
			K = N * this.height / 2;
			r = this.startAngle * Math.PI / 180;
			F = M * K / Math.sqrt(K * K * Math.cos(r) * Math.cos(r) + M * M * Math.sin(r) * Math.sin(r));
			H = F * Math.cos(r);
			v = F * Math.sin(r);
			H = w + H;
			v = u + v;
			A = (j + q) * Math.PI / 180;
			E = M * K / Math.sqrt(K * K * Math.cos(A) * Math.cos(A) + M * M * Math.sin(A) * Math.sin(A));
			G = E * Math.cos(A);
			t = E * Math.sin(A);
			G = w + G;
			t = u + t;
			var C = I.getSVG();
			if (h) {
				C.appendChild(g);
				h = false
			}
			if (!this.pen) {
				g.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(g)
			}
			if (!this.brush) {
				g.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(g, I.getDefs())
			}
			if (q > 180) {
				g.setAttribute("d", "M" + H + " " + v + " A" + M + " " + K + " 0 1 1 " + G + " " + t)
			} else {
				g.setAttribute("d", "M" + H + " " + v + " A" + M + " " + K + " 0 0 1 " + G + " " + t)
			}
		} else {
			var s = I.getVML(), J;
			if (h) {
				s.appendChild(g);
				h = false
			}
			var M, K, F, E, r, A, z, B, D;
			D = this.startAngle + this.arcAngle;
			j = this.startAngle % 360;
			D = D % 360;
			M = N * this.width / 2;
			K = N * this.height / 2;
			r = this.startAngle * Math.PI / 180;
			F = M * K / Math.sqrt(K * K * Math.cos(r) * Math.cos(r) + M * M * Math.sin(r) * Math.sin(r));
			z = Math.asin(F * Math.sin(r) / K) * 180 / Math.PI;
			if (this.startAngle > 270) {
				z = 360 + z
			} else {
				if (this.startAngle > 90) {
					z = 180 - z
				}
			}
			A = D * Math.PI / 180;
			E = M * K / Math.sqrt(K * K * Math.cos(A) * Math.cos(A) + M * M * Math.sin(A) * Math.sin(A));
			B = Math.asin(E * Math.sin(A) / K) * 180 / Math.PI;
			if (D > 270) {
				B = 360 + B
			} else {
				if (D > 90) {
					B = 180 - B
				}
			}
			if (!this.pen) {
				g.Stroked = "False"
			} else {
				this.pen.updateVML(g)
			}
			J = g.fill;
			if (!this.brush) {
				J.On = "false"
			} else {
				this.brush.updateVML(J)
			}
			g.style.position = "absolute";
			g.style.width = N * this.width;
			g.style.height = N * this.height;
			g.style.position = "absolute";
			g.style.left = w - N * this.width / 2;
			g.style.top = u - N * this.height / 2;
			z = z + 90;
			if (z > 360) {
				g.StartAngle = z % 360
			} else {
				g.StartAngle = z
			}
			B = B + 90;
			if (B > 360) {
				if (z <= 360) {
					g.StartAngle = z - 360
				}
				g.EndAngle = B % 360
			} else {
				g.EndAngle = B
			}
		}
		g.style.display = "";
		if (o && I != o) {
			o.removeShape(this)
		}
		o = I;
		o.addShape(this)
	}
	this.remove = d;
	function d() {
		if (o) {
			if (!jsDraw2DX._isVML) {
				var s = o.getSVG();
				s.removeChild(g)
			} else {
				var r = o.getVML();
				r.removeChild(g)
			}
			o.removeShape(this);
			o = null;
			h = true
		}
	}
	this.show = n;
	function n() {
		g.style.display = ""
	}
	this.hide = f;
	function f() {
		g.style.display = "none"
	}

}

function jxArcSector(a, b, p, j, q, e, k) {
	this.center = a;
	this.width = b;
	this.height = p;
	this.startAngle = j;
	this.arcAngle = q;
	this.pen = null;
	this.brush = null;
	var g, h = true;
	var o;
	if (e) {
		this.pen = e
	}
	if (k) {
		this.brush = k
	}
	if (!jsDraw2DX._isVML) {
		g = document.createElementNS("http://www.w3.org/2000/svg", "path")
	} else {
		g = document.createElement("v:shape")
	}
	this.getType = l;
	function l() {
		return "jxArcSector"
	}
	this.addEventListener = c;
	function c(s, t) {
		if (g.addEventListener) {
			g.addEventListener(s, u, false)
		} else {
			if (g.attachEvent) {
				g.attachEvent("on" + s, u)
			}
		}
		var r = this;
		function u(v) {
			t(v, r)
		}

	}
	this.draw = m;
	function m(L) {
		var O, Q;
		O = L.logicalToPhysicalPoint(this.center);
		Q = L.scale;
		var A, v;
		A = O.x;
		v = O.y;
		var P, N, H, G, K, J, z, u, r, B;
		P = Q * this.width / 2;
		N = Q * this.height / 2;
		r = this.startAngle * Math.PI / 180;
		H = P * N / Math.sqrt(N * N * Math.cos(r) * Math.cos(r) + P * P * Math.sin(r) * Math.sin(r));
		K = H * Math.cos(r);
		z = H * Math.sin(r);
		K = A + K;
		z = v + z;
		B = (this.startAngle + this.arcAngle) * Math.PI / 180;
		G = P * N / Math.sqrt(N * N * Math.cos(B) * Math.cos(B) + P * P * Math.sin(B) * Math.sin(B));
		J = G * Math.cos(B);
		u = G * Math.sin(B);
		J = A + J;
		u = v + u;
		g.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var E = L.getSVG();
			if (h) {
				E.appendChild(g);
				h = false
			}
			if (!this.pen) {
				g.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(g)
			}
			if (!this.brush) {
				g.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(g, L.getDefs())
			}
			if (q > 180) {
				g.setAttribute("d", "M" + A + " " + v + " L" + K + " " + z + " A" + P + " " + N + " 0 1 1 " + J + " " + u + " Z")
			} else {
				g.setAttribute("d", "M" + A + " " + v + " L" + K + " " + z + " A" + P + " " + N + " 0 0 1 " + J + " " + u + " Z")
			}
		} else {
			var s = L.getVML(), M;
			if (h) {
				s.appendChild(g);
				h = false
			}
			var D, F, I, C;
			D = Math.min(u, Math.min(v, z));
			F = Math.min(J, Math.min(A, K));
			I = Math.max(u, Math.max(v, z)) - D;
			C = Math.max(J, Math.max(A, K)) - F;
			if (!this.pen) {
				g.Stroked = "False"
			} else {
				this.pen.updateVML(g)
			}
			M = g.fill;
			if (!this.brush) {
				M.On = "false"
			} else {
				this.brush.updateVML(M)
			}
			g.style.position = "absolute";
			g.style.height = 1;
			g.style.width = 1;
			g.CoordSize = 1 + " " + 1;
			g.Path = "M" + A + "," + v + " AT" + (A - P) + "," + (v - N) + "," + (A + P) + "," + (v + N) + "," + Math.round(J) + "," + Math.round(u) + "," + Math.round(K) + "," + Math.round(z) + " X E"
		}
		g.style.display = "";
		if (o && L != o) {
			o.removeShape(this)
		}
		o = L;
		o.addShape(this)
	}
	this.remove = d;
	function d() {
		if (o) {
			if (!jsDraw2DX._isVML) {
				var s = o.getSVG();
				s.removeChild(g)
			} else {
				var r = o.getVML();
				r.removeChild(g)
			}
			o.removeShape(this);
			o = null;
			h = true
		}
	}
	this.show = n;
	function n() {
		g.style.display = ""
	}
	this.hide = f;
	function f() {
		g.style.display = "none"
	}

}

function jxCurve(n, c, g, l) {
	this.points = n;
	this.pen = null;
	this.brush = null;
	this.tension = 1;
	var e, f = true;
	var m;
	if (c) {
		this.pen = c
	}
	if (g) {
		this.brush = g
	}
	if (l != null) {
		this.tension = l
	}
	if (!jsDraw2DX._isVML) {
		e = document.createElementNS("http://www.w3.org/2000/svg", "path")
	} else {
		e = document.createElement("v:shape")
	}
	this.getType = h;
	function h() {
		return "jxCurve"
	}
	this.addEventListener = a;
	function a(p, q) {
		if (e.addEventListener) {
			e.addEventListener(p, r, false)
		} else {
			if (e.attachEvent) {
				e.attachEvent("on" + p, r)
			}
		}
		var o = this;
		function r(s) {
			q(s, o)
		}

	}
	this.draw = j;
	function j(u) {
		var v = new Array();
		for (ind in this.points) {
			v[ind] = u.logicalToPhysicalPoint(this.points[ind])
		}
		var z, p = this.tension, t = new Array(), w = new Array(), q = new Array();
		for (i in v) {
			i = parseInt(i);
			if (i == 0) {
				t[i] = new jxPoint(p * (v[1].x - v[0].x) / 2, p * (v[1].y - v[0].y) / 2)
			} else {
				if (i == v.length - 1) {
					t[i] = new jxPoint(p * (v[i].x - v[i - 1].x) / 2, p * (v[i].y - v[i - 1].y) / 2)
				} else {
					t[i] = new jxPoint(p * (v[i + 1].x - v[i - 1].x) / 2, p * (v[i + 1].y - v[i - 1].y) / 2)
				}
			}
		}
		for (i in v) {
			i = parseInt(i);
			if (i == v.length - 1) {
				w[i] = new jxPoint(v[i].x + t[i].x / 3, v[i].y + t[i].y / 3);
				q[i] = new jxPoint(v[i].x - t[i].x / 3, v[i].y - t[i].y / 3)
			} else {
				w[i] = new jxPoint(v[i].x + t[i].x / 3, v[i].y + t[i].y / 3);
				q[i] = new jxPoint(v[i + 1].x - t[i + 1].x / 3, v[i + 1].y - t[i + 1].y / 3)
			}
		}
		for (i in v) {
			i = parseInt(i);
			if (i == 0) {
				z = "M" + v[i].x + "," + v[i].y
			}
			if (i < v.length - 1) {
				z = z + " C" + Math.round(w[i].x) + "," + Math.round(w[i].y) + "," + Math.round(q[i].x) + "," + Math.round(q[i].y) + "," + Math.round(v[i + 1].x) + "," + Math.round(v[i + 1].y)
			}
		}
		e.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var s = u.getSVG();
			if (f) {
				s.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(e)
			}
			if (!this.brush) {
				e.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(e, u.getDefs())
			}
			e.setAttribute("d", z)
		} else {
			var o = u.getVML(), r;
			if (f) {
				o.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.Stroked = "False"
			} else {
				this.pen.updateVML(e)
			}
			r = e.fill;
			if (!this.brush) {
				r.On = "false"
			} else {
				this.brush.updateVML(r)
			}
			z = z + " E";
			e.style.position = "absolute";
			e.style.width = 1;
			e.style.height = 1;
			e.CoordSize = 1 + " " + 1;
			e.Path = z
		}
		e.style.display = "";
		if (m && u != m) {
			m.removeShape(this)
		}
		m = u;
		m.addShape(this)
	}
	this.remove = b;
	function b() {
		if (m) {
			if (!jsDraw2DX._isVML) {
				var p = m.getSVG();
				p.removeChild(e)
			} else {
				var o = m.getVML();
				o.removeChild(e)
			}
			m.removeShape(this);
			m = null;
			f = true
		}
	}
	this.show = k;
	function k() {
		e.style.display = ""
	}
	this.hide = d;
	function d() {
		e.style.display = "none"
	}

}

function jxClosedCurve(n, c, g, l) {
	this.points = n;
	this.pen = null;
	this.brush = null;
	this.tension = 1;
	var e, f = true;
	var m;
	var e = null;
	if (c) {
		this.pen = c
	}
	if (g) {
		this.brush = g
	}
	if (l != null) {
		this.tension = l
	}
	if (!jsDraw2DX._isVML) {
		e = document.createElementNS("http://www.w3.org/2000/svg", "path")
	} else {
		e = document.createElement("v:shape")
	}
	this.getType = h;
	function h() {
		return "jxClosedCurve"
	}
	this.addEventListener = a;
	function a(p, q) {
		if (e.addEventListener) {
			e.addEventListener(p, r, false)
		} else {
			if (e.attachEvent) {
				e.attachEvent("on" + p, r)
			}
		}
		var o = this;
		function r(s) {
			q(s, o)
		}

	}
	this.draw = j;
	function j(v) {
		var w = new Array();
		for (ind in this.points) {
			w[ind] = v.logicalToPhysicalPoint(this.points[ind])
		}
		var A, p = w.length - 1, q = this.tension, u = new Array(), z = new Array(), r = new Array();
		for (i in w) {
			i = parseInt(i);
			if (i == 0) {
				u[i] = new jxPoint(q * (w[1].x - w[p].x) / 2, q * (w[1].y - w[p].y) / 2)
			} else {
				if (i == w.length - 1) {
					u[i] = new jxPoint(q * (w[0].x - w[i - 1].x) / 2, q * (w[0].y - w[i - 1].y) / 2)
				} else {
					u[i] = new jxPoint(q * (w[i + 1].x - w[i - 1].x) / 2, q * (w[i + 1].y - w[i - 1].y) / 2)
				}
			}
		}
		for (i in w) {
			i = parseInt(i);
			if (i == w.length - 1) {
				z[i] = new jxPoint(w[i].x + u[i].x / 3, w[i].y + u[i].y / 3);
				r[i] = new jxPoint(w[0].x - u[0].x / 3, w[0].y - u[0].y / 3)
			} else {
				z[i] = new jxPoint(w[i].x + u[i].x / 3, w[i].y + u[i].y / 3);
				r[i] = new jxPoint(w[i + 1].x - u[i + 1].x / 3, w[i + 1].y - u[i + 1].y / 3)
			}
		}
		for (i in w) {
			i = parseInt(i);
			if (i == 0) {
				A = "M" + w[i].x + "," + w[i].y
			}
			if (i < w.length - 1) {
				A = A + " C" + Math.round(z[i].x) + "," + Math.round(z[i].y) + "," + Math.round(r[i].x) + "," + Math.round(r[i].y) + "," + Math.round(w[i + 1].x) + "," + Math.round(w[i + 1].y)
			}
			if (i == w.length - 1) {
				A = A + " C" + Math.round(z[i].x) + "," + Math.round(z[i].y) + "," + Math.round(r[i].x) + "," + Math.round(r[i].y) + "," + Math.round(w[0].x) + "," + Math.round(w[0].y)
			}
		}
		e.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var t = v.getSVG();
			if (f) {
				t.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(e)
			}
			if (!this.brush) {
				e.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(e, v.getDefs())
			}
			e.setAttribute("d", A)
		} else {
			var o = v.getVML(), s;
			if (f) {
				o.appendChild(e);
				f = false
			}
			A = A + " E";
			if (!this.pen) {
				e.Stroked = "False"
			} else {
				this.pen.updateVML(e)
			}
			s = e.fill;
			if (!this.brush) {
				s.On = "false"
			} else {
				this.brush.updateVML(s)
			}
			e.style.position = "absolute";
			e.style.width = 1;
			e.style.height = 1;
			e.CoordSize = 1 + " " + 1;
			e.Path = A
		}
		e.style.display = "";
		if (m && v != m) {
			m.removeShape(this)
		}
		m = v;
		m.addShape(this)
	}
	this.remove = b;
	function b() {
		if (m) {
			if (!jsDraw2DX._isVML) {
				var p = m.getSVG();
				p.removeChild(e)
			} else {
				var o = m.getVML();
				o.removeChild(e)
			}
			m.removeShape(this);
			m = null;
			f = true
		}
	}
	this.show = k;
	function k() {
		e.style.display = ""
	}
	this.hide = d;
	function d() {
		e.style.display = "none"
	}

}

function jxBezier(m, c, g) {
	this.points = m;
	this.pen = null;
	this.brush = null;
	var e, f = true;
	var l;
	if (c) {
		this.pen = c
	}
	if (g) {
		this.brush = g
	}
	if (!jsDraw2DX._isVML) {
		e = document.createElementNS("http://www.w3.org/2000/svg", "path")
	} else {
		e = document.createElement("v:shape")
	}
	this.getType = h;
	function h() {
		return "jxBezier"
	}
	this.addEventListener = a;
	function a(o, p) {
		if (e.addEventListener) {
			e.addEventListener(o, q, false)
		} else {
			if (e.attachEvent) {
				e.attachEvent("on" + o, q)
			}
		}
		var n = this;
		function q(r) {
			p(r, n)
		}

	}
	this.draw = j;
	function j(H) {
		var B = new Array();
		for (ind in this.points) {
			B[ind] = H.logicalToPhysicalPoint(this.points[ind])
		}
		var w;
		if (B.length > 4) {
			var G = new Array();
			var u = new Array();
			var r = new Array();
			var E = new Array();
			var A = B.length - 1;
			var F, D, C, z, s, J = 10 * Math.min(1 / Math.abs(B[A].x - B[0].x), 1 / Math.abs(B[A].y - B[0].y));
			z = 0;
			for ( s = 0; s < 1; s += J) {
				x = 0;
				y = 0;
				for ( C = 0; C <= A; C++) {
					F = Math.pow(s, C) * Math.pow((1 - s), A - C) * B[C].x;
					if (C != 0 || C != A) {
						F = F * jsDraw2DX.fact(A) / jsDraw2DX.fact(C) / jsDraw2DX.fact(A - C)
					}
					x = x + F;
					D = Math.pow(s, C) * Math.pow((1 - s), A - C) * B[C].y;
					if (C != 0 || C != A) {
						D = D * jsDraw2DX.fact(A) / jsDraw2DX.fact(C) / jsDraw2DX.fact(A - C)
					}
					y = y + D
				}
				E[z] = new jxPoint(x, y);
				z++
			}
			E[z] = new jxPoint(B[A].x, B[A].y);
			B = E;
			tension = 1;
			for (C in B) {
				C = parseInt(C);
				if (C == 0) {
					G[C] = new jxPoint(tension * (B[1].x - B[0].x) / 2, tension * (B[1].y - B[0].y) / 2)
				} else {
					if (C == B.length - 1) {
						G[C] = new jxPoint(tension * (B[C].x - B[C - 1].x) / 2, tension * (B[C].y - B[C - 1].y) / 2)
					} else {
						G[C] = new jxPoint(tension * (B[C + 1].x - B[C - 1].x) / 2, tension * (B[C + 1].y - B[C - 1].y) / 2)
					}
				}
			}
			for (C in B) {
				C = parseInt(C);
				if (C == 0) {
					u[C] = new jxPoint(B[0].x + G[0].x / 3, B[0].y + G[0].y / 3);
					r[C] = new jxPoint(B[1].x - G[1].x / 3, B[1].y - G[1].y / 3)
				} else {
					if (C == B.length - 1) {
						u[C] = new jxPoint(B[C].x + G[C].x / 3, B[C].y + G[C].y / 3);
						r[C] = new jxPoint(B[C].x - G[C].x / 3, B[C].y - G[C].y / 3)
					} else {
						u[C] = new jxPoint(B[C].x + G[C].x / 3, B[C].y + G[C].y / 3);
						r[C] = new jxPoint(B[C + 1].x - G[C + 1].x / 3, B[C + 1].y - G[C + 1].y / 3)
					}
				}
			}
			for (C in B) {
				C = parseInt(C);
				if (C == 0) {
					w = "M" + B[C].x + "," + B[C].y
				}
				if (C < B.length - 1) {
					w = w + " C" + Math.round(u[C].x) + "," + Math.round(u[C].y) + "," + Math.round(r[C].x) + "," + Math.round(r[C].y) + "," + Math.round(B[C + 1].x) + "," + Math.round(B[C + 1].y)
				}
			}
		} else {
			if (B.length == 4) {
				w = " M" + B[0].x + "," + B[0].y + " C" + B[1].x + "," + B[1].y + " " + B[2].x + "," + B[2].y + " " + B[3].x + "," + B[3].y
			} else {
				if (B.length == 3) {
					if (!jsDraw2DX._isVML) {
						w = " M" + B[0].x + "," + B[0].y + " Q" + B[1].x + "," + B[1].y + " " + B[2].x + "," + B[2].y
					} else {
						var o = new jxPoint(2 / 3 * B[1].x + 1 / 3 * B[0].x, 2 / 3 * B[1].y + 1 / 3 * B[0].y);
						var q = new jxPoint(2 / 3 * B[1].x + 1 / 3 * B[2].x, 2 / 3 * B[1].y + 1 / 3 * B[2].y);
						w = " M" + B[0].x + "," + B[0].y + " C" + Math.round(o.x) + "," + Math.round(o.y) + " " + Math.round(q.x) + "," + Math.round(q.y) + " " + B[2].x + "," + B[2].y
					}
				}
			}
		}
		e.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var v = H.getSVG();
			if (f) {
				v.appendChild(e);
				f = false
			}
			if (!this.pen) {
				e.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(e)
			}
			if (!this.brush) {
				e.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(e, H.getDefs())
			}
			e.setAttribute("d", w)
		} else {
			var p = H.getVML(), I;
			if (f) {
				p.appendChild(e);
				f = false
			}
			w = w + " E";
			if (!this.pen) {
				e.Stroked = "False"
			} else {
				this.pen.updateVML(e)
			}
			I = e.fill;
			if (!this.brush) {
				I.On = "false"
			} else {
				this.brush.updateVML(I)
			}
			e.style.position = "absolute";
			e.style.width = 1;
			e.style.height = 1;
			e.CoordSize = 1 + " " + 1;
			e.Path = w
		}
		e.style.display = "";
		if (l && H != l) {
			l.removeShape(this)
		}
		l = H;
		l.addShape(this)
	}
	this.remove = b;
	function b() {
		if (l) {
			if (!jsDraw2DX._isVML) {
				var o = l.getSVG();
				o.removeChild(e)
			} else {
				var n = l.getVML();
				n.removeChild(e)
			}
			l.removeShape(this);
			l = null;
			f = true
		}
	}
	this.show = k;
	function k() {
		e.style.display = ""
	}
	this.hide = d;
	function d() {
		e.style.display = "none"
	}

}

function jxFunctionGraph(fn, xMin, xMax, pen, brush) {
	this.fn = fn;
	this.xMin = xMin;
	this.xMax = xMax;
	this.pen = null;
	this.brush = null;
	var _svgvmlObj, _isFirst = true;
	var _graphics;
	if (pen) {
		this.pen = pen
	}
	if (brush) {
		this.brush = brush
	}
	if (!jsDraw2DX._isVML) {
		_svgvmlObj = document.createElementNS("http://www.w3.org/2000/svg", "path")
	} else {
		_svgvmlObj = document.createElement("v:shape")
	}
	this.getType = getType;
	function getType() {
		return "jxFunctionGraph"
	}
	this.addEventListener = addEventListener;
	function addEventListener(eventName, handler) {
		if (_svgvmlObj.addEventListener) {
			_svgvmlObj.addEventListener(eventName, handlerWrapper, false)
		} else {
			if (_svgvmlObj.attachEvent) {
				_svgvmlObj.attachEvent("on" + eventName, handlerWrapper)
			}
		}
		var currentObj = this;
		function handlerWrapper(evt) {
			handler(evt, currentObj)
		}

	}
	this.validate = validate;
	function validate(fn) {
		fn = fn.replace(/x/g, 1);
		with (Math) {
			try {
				eval(fn);
				return true
			} catch(ex) {
				return false
			}
		}
	}
	this.draw = draw;
	function draw(graphics) {
		var points = new Array();
		var path, pDpoints;
		var pDpoints = new Array();
		var b1points = new Array();
		var b2points = new Array();
		if (!this.validate(fn)) {
			return
		}
		var x, y, ic = 0;
		for ( x = xMin; x < xMax; x++) {
			with (Math) {
				y = eval(fn.replace(/x/g, x))
			}
			points[ic] = graphics.logicalToPhysicalPoint(new jxPoint(x, y));
			ic++
		}
		with (Math) {
			y = eval(fn.replace(/x/g, xMax))
		}
		points[ic] = graphics.logicalToPhysicalPoint(new jxPoint(x, y));
		ic++;
		tension = 1;
		for (i in points) {
			i = parseInt(i);
			if (i == 0) {
				pDpoints[i] = new jxPoint(tension * (points[1].x - points[0].x) / 2, tension * (points[1].y - points[0].y) / 2)
			} else {
				if (i == points.length - 1) {
					pDpoints[i] = new jxPoint(tension * (points[i].x - points[i - 1].x) / 2, tension * (points[i].y - points[i - 1].y) / 2)
				} else {
					pDpoints[i] = new jxPoint(tension * (points[i + 1].x - points[i - 1].x) / 2, tension * (points[i + 1].y - points[i - 1].y) / 2)
				}
			}
		}
		for (i in points) {
			i = parseInt(i);
			if (i == 0) {
				b1points[i] = new jxPoint(points[0].x + pDpoints[0].x / 3, points[0].y + pDpoints[0].y / 3);
				b2points[i] = new jxPoint(points[1].x - pDpoints[1].x / 3, points[1].y - pDpoints[1].y / 3)
			} else {
				if (i == points.length - 1) {
					b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
					b2points[i] = new jxPoint(points[i].x - pDpoints[i].x / 3, points[i].y - pDpoints[i].y / 3)
				} else {
					b1points[i] = new jxPoint(points[i].x + pDpoints[i].x / 3, points[i].y + pDpoints[i].y / 3);
					b2points[i] = new jxPoint(points[i + 1].x - pDpoints[i + 1].x / 3, points[i + 1].y - pDpoints[i + 1].y / 3)
				}
			}
		}
		for (i in points) {
			i = parseInt(i);
			if (i == 0) {
				path = "M" + points[i].x + "," + points[i].y
			}
			if (i < points.length - 1) {
				path = path + " C" + Math.round(b1points[i].x) + "," + Math.round(b1points[i].y) + "," + Math.round(b2points[i].x) + "," + Math.round(b2points[i].y) + "," + Math.round(points[i + 1].x) + "," + Math.round(points[i + 1].y)
			}
		}
		_svgvmlObj.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var svg = graphics.getSVG();
			if (_isFirst) {
				svg.appendChild(_svgvmlObj);
				_isFirst = false
			}
			if (!this.pen) {
				_svgvmlObj.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(_svgvmlObj)
			}
			if (!this.brush) {
				_svgvmlObj.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(_svgvmlObj, graphics.getDefs())
			}
			_svgvmlObj.setAttribute("d", path)
		} else {
			var vml = graphics.getVML(), vmlFill;
			if (_isFirst) {
				vml.appendChild(_svgvmlObj);
				_isFirst = false
			}
			path = path + " E";
			if (!this.pen) {
				_svgvmlObj.Stroked = "False"
			} else {
				this.pen.updateVML(_svgvmlObj)
			}
			vmlFill = _svgvmlObj.fill;
			if (!this.brush) {
				vmlFill.On = "false"
			} else {
				this.brush.updateVML(vmlFill)
			}
			_svgvmlObj.style.position = "absolute";
			_svgvmlObj.style.width = 1;
			_svgvmlObj.style.height = 1;
			_svgvmlObj.CoordSize = 1 + " " + 1;
			_svgvmlObj.Path = path
		}
		_svgvmlObj.style.display = "";
		if (_graphics && graphics != _graphics) {
			_graphics.removeShape(this)
		}
		_graphics = graphics;
		_graphics.addShape(this)
	}
	this.remove = remove;
	function remove() {
		if (_graphics) {
			if (!jsDraw2DX._isVML) {
				var svg = _graphics.getSVG();
				svg.removeChild(_svgvmlObj)
			} else {
				var vml = _graphics.getVML();
				vml.removeChild(_svgvmlObj)
			}
			_graphics.removeShape(this);
			_graphics = null;
			_isFirst = true
		}
	}
	this.show = show;
	function show() {
		_svgvmlObj.style.display = ""
	}
	this.hide = hide;
	function hide() {
		_svgvmlObj.style.display = "none"
	}

}

function jxText(o, p, a, e, j, b) {
	this.point = o;
	this.text = p;
	this.font = null;
	this.pen = null;
	this.brush = null;
	this.angle = 0;
	var g, h = true;
	var n;
	if (a) {
		this.font = a
	}
	if (e) {
		this.pen = e
	}
	if (j) {
		this.brush = j
	}
	if (b) {
		this.angle = b
	}
	if (!jsDraw2DX._isVML) {
		g = document.createElementNS("http://www.w3.org/2000/svg", "text")
	} else {
		g = document.createElement("v:shape")
	}
	this.getType = k;
	function k() {
		return "jxText"
	}
	this.addEventListener = c;
	function c(r, s) {
		if (g.addEventListener) {
			g.addEventListener(r, t, false)
		} else {
			if (g.attachEvent) {
				g.attachEvent("on" + r, t)
			}
		}
		var q = this;
		function t(u) {
			s(u, q)
		}

	}
	this.draw = l;
	function l(B) {
		var F;
		F = B.logicalToPhysicalPoint(this.point);
		var E, A;
		E = F.x;
		A = F.y;
		g.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var w = B.getSVG();
			if (h) {
				w.appendChild(g);
				h = false
			}
			if (!this.pen) {
				g.setAttribute("stroke", "none")
			} else {
				this.pen.updateSVG(g)
			}
			if (!this.brush) {
				g.setAttribute("fill", "none")
			} else {
				this.brush.updateSVG(g, B.getDefs())
			}
			if (this.font) {
				this.font.updateSVG(g)
			} else {
				jxFont.updateSVG(g)
			}
			g.setAttribute("x", E);
			g.setAttribute("y", A);
			g.setAttribute("transform", "rotate(" + this.angle + " " + E + "," + A + ")");
			g.textContent = this.text
		} else {
			var s = B.getVML(), v, z, u;
			if (h) {
				u = document.createElement("v:textpath");
				u.On = "True";
				u.style["v-text-align"] = "left";
				g.appendChild(u);
				s.appendChild(g);
				h = false
			}
			v = g.fill;
			u = g.firstChild;
			if (!this.pen) {
				g.Stroked = "False"
			} else {
				this.pen.updateVML(g)
			}
			v = g.fill;
			if (!this.brush) {
				v.On = "false"
			} else {
				this.brush.updateVML(v)
			}
			g.style.position = "absolute";
			g.style.height = 1;
			g.CoordSize = 1 + " " + 1;
			z = g.Path;
			z.TextPathOk = "true";
			z.v = "M" + E + "," + A + " L" + (E + 100) + "," + A + " E";
			u.String = this.text;
			if (this.font) {
				this.font.updateVML(u)
			} else {
				jxFont.updateVML(u)
			}
			g.style.display = "";
			var t, D, q, C;
			q = (g.clientHeight / 2 * 0.8);
			C = this.angle;
			E = Math.round(E + q * Math.sin(C * Math.PI / 180));
			A = Math.round(A - q * Math.cos(C * Math.PI / 180));
			t = Math.round(E + Math.cos(C * Math.PI / 180) * 100);
			D = Math.round(A + Math.sin(C * Math.PI / 180) * 100);
			g.Path = "M" + E + "," + A + " L" + t + "," + D + " E";
			g.style.width = 1
		}
		g.style.display = "";
		if (n && B != n) {
			n.removeShape(this)
		}
		n = B;
		n.addShape(this)
	}
	this.remove = d;
	function d() {
		if (n) {
			if (!jsDraw2DX._isVML) {
				var r = n.getSVG();
				r.removeChild(g)
			} else {
				var q = n.getVML();
				q.removeChild(g)
			}
			n.removeShape(this);
			n = null;
			h = true
		}
	}
	this.show = m;
	function m() {
		g.style.display = ""
	}
	this.hide = f;
	function f() {
		g.style.display = "none"
	}

}

function jxImage(point, url, width, height, angle) {
	this.point = point;
	this.url = url;
	this.width = width;
	this.height = height;
	this.angle = 0;
	var _svgvmlObj, _isFirst = true;
	var _graphics;
	if (angle) {
		this.angle = angle
	}
	if (!jsDraw2DX._isVML) {
		_svgvmlObj = document.createElementNS("http://www.w3.org/2000/svg", "image")
	} else {
		_svgvmlObj = document.createElement("v:image")
	}
	this.getType = getType;
	function getType() {
		return "jxImage"
	}
	this.addEventListener = addEventListener;
	function addEventListener(eventName, handler) {
		if (_svgvmlObj.addEventListener) {
			_svgvmlObj.addEventListener(eventName, handlerWrapper, false)
		} else {
			if (_svgvmlObj.attachEvent) {
				_svgvmlObj.attachEvent("on" + eventName, handlerWrapper)
			}
		}
		var currentObj = this;
		function handlerWrapper(evt) {
			handler(evt, currentObj)
		}

	}
	this.draw = draw;
	function draw(graphics) {
		var point, scale;
		point = graphics.logicalToPhysicalPoint(this.point);
		scale = graphics.scale;
		var x, y;
		x = point.x;
		y = point.y;
		_svgvmlObj.style.display = "none";
		if (!jsDraw2DX._isVML) {
			var svg = graphics.getSVG();
			if (_isFirst) {
				svg.appendChild(_svgvmlObj);
				_isFirst = false
			}
			_svgvmlObj.setAttribute("x", x);
			_svgvmlObj.setAttribute("y", y);
			_svgvmlObj.setAttribute("height", scale * this.height);
			_svgvmlObj.setAttribute("width", scale * this.width);
			_svgvmlObj.setAttribute("preserveAspectRatio", "none");
			_svgvmlObj.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.url);
			_svgvmlObj.setAttribute("transform", "rotate(" + this.angle + " " + x + "," + y + ")")
		} else {
			with (Math) {
				var x1, y1, ang = this.angle, a = this.angle * PI / 180, w, h, m1, m2, m3, m4;
				w = scale * this.width;
				h = scale * this.height;
				x1 = x;
				y1 = y;
				if (abs(ang) > 360) {
					ang = ang % 360
				}
				if (ang < 0) {
					ang = 360 + ang
				}
				if (ang >= 0 && ang < 90) {
					y1 = y;
					x1 = x - (h * sin(a))
				} else {
					if (ang >= 90 && ang < 180) {
						y1 = y - h * sin(a - PI / 2);
						x1 = x - (w * sin(a - PI / 2) + h * cos(a - PI / 2))
					} else {
						if (ang >= 180 && ang < 270) {
							y1 = y - (w * sin(a - PI) + h * cos(a - PI));
							x1 = x - w * cos(a - PI)
						} else {
							if (ang >= 270 && ang <= 360) {
								x1 = x;
								y1 = y - w * cos(a - 1.5 * PI)
							}
						}
					}
				}
				m1 = cos(a);
				m2 = -sin(a);
				m3 = sin(a);
				m4 = cos(a)
			}
			var vml = graphics.getVML(), vmlFill;
			if (_isFirst) {
				vml.appendChild(_svgvmlObj);
				_isFirst = false
			}
			_svgvmlObj.style.width = w;
			_svgvmlObj.style.height = h;
			_svgvmlObj.style.position = "absolute";
			_svgvmlObj.style.top = y1;
			_svgvmlObj.style.left = x1;
			_svgvmlObj.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11=" + m1 + ",M12=" + m2 + ",M21=" + m3 + ",M22=" + m4 + ") filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url + "', sizingMethod='scale');"
		}
		_svgvmlObj.style.display = "";
		if (_graphics && graphics != _graphics) {
			_graphics.removeShape(this)
		}
		_graphics = graphics;
		_graphics.addShape(this)
	}
	this.remove = remove;
	function remove() {
		if (_graphics) {
			if (!jsDraw2DX._isVML) {
				var svg = _graphics.getSVG();
				svg.removeChild(_svgvmlObj)
			} else {
				var vml = _graphics.getVML();
				vml.removeChild(_svgvmlObj)
			}
			_graphics.removeShape(this);
			_graphics = null;
			_isFirst = true
		}
	}
	this.show = show;
	function show() {
		_svgvmlObj.style.display = ""
	}
	this.hide = hide;
	function hide() {
		_svgvmlObj.style.display = "none"
	}

};