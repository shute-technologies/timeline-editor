/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

 // Converted to TS file for integration purpose
export class Easing {

	static Equations = {

		easeLinear(t, b, c, d) { return c * t / d + b; },
		easeInQuad(t, b, c, d) { return c*(t/=d)*t + b; },
		easeOutQuad(t, b, c, d) { return -c *(t/=d)*(t-2) + b; },
		easeInOutQuad(t, b, c, d) { 
			if ((t/=d/2) < 1) return c/2*t*t + b; 	
			return -c/2 * ((--t)*(t-2) - 1) + b; 
		},
		easeInCubic(t, b, c, d) { return c*(t/=d)*t*t + b; },
		easeOutCubic(t, b, c, d) { return c*((t=t/d-1)*t*t + 1) + b; },
		easeInOutCubic(t, b, c, d) { 
			if ((t/=d/2) < 1) return c/2*t*t*t + b; 	
			return c/2*((t-=2)*t*t + 2) + b; 
		},
		easeInQuart(t, b, c, d) { return c*(t/=d)*t*t*t + b; },
		easeOutQuart(t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; },
		easeInOutQuart(t, b, c, d) { 
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b; 
		},
		easeInQuint(t, b, c, d) { return c*(t/=d)*t*t*t*t + b; },
		easeOutQuint(t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; },
		easeInOutQuint(t, b, c, d) { 
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine(t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },
		easeOutSine(t, b, c, d) { return c * Math.sin(t/d * (Math.PI/2)) + b; },
		easeInOutSine(t, b, c, d) { return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; },
		easeInExpo(t, b, c, d) { return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },
		easeOutExpo(t, b, c, d) { return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; },
		easeInOutExpo(t, b, c, d) { 
			if (t==0) return b; 	
			if (t==d) return b+c; 	
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b; 	
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b; 
		},
		easeInCirc(t, b, c, d) { return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; },
		easeOutCirc(t, b, c, d) { return c * Math.sqrt(1 - (t=t/d-1)*t) + b; },
		easeInOutCirc(t, b, c, d) { 
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; 
		},
		easeInElastic(t, b, c, d) { 
			var s=1.70158;
			var p=0;
			var a=c; 	

			if (t==0) return b;
			if ((t/=d)==1) return b+c;
			if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a); 	

			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; 
		},
		easeOutElastic(t, b, c, d) { 
			var s=1.70158;
			var p=0;
			var a=c; 	
			if (t==0) return b;  
			if ((t/=d)==1) return b+c;  
			if (!p) p=d*.3; 	
			if (a < Math.abs(c)) { 
				a=c; 
				var s=p/4; 
			} else var s = p/(2*Math.PI) * Math.asin (c/a); 	
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; 
		},
		easeInOutElastic(t, b, c, d) { 
			var s=1.70158;
			var p=0;
			var a=c; 	
			if (t==0) return b;  
			if ((t/=d/2)==2) return b+c;  
			if (!p) p=d*(.3*1.5); 	
			if (a < Math.abs(c)) { 
				a=c; 
				var s=p/4; 
			} else var s = p/(2*Math.PI) * Math.asin (c/a); 	
			
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; 	
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; 
		},
		//easeInBack(t, b, c, d, s) {
		//	if (s == undefined) s = 1.70158; //	return c*(t/=d)*t*((s+1)*t - s) + b; //},
		//easeOutBack(t, b, c, d, s) {
		//	if (s == undefined) s = 1.70158; //	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; //},
		//easeInOutBack(t, b, c, d, s) {
		//	if (s == undefined) s = 1.70158; 
		//	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; //	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; //},
		//easeInBounce(t, b, c, d) {
		//	return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b; //},
		easeOutBounce(t, b, c, d) { 
			if ((t/=d) < (1/2.75)) { 	
				return c*(7.5625*t*t) + b; 	
			} else if (t < (2/2.75)) { 	
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b; 	
			} else if (t < (2.5/2.75)) { 	
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b; 	
			} else { 	
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b; 	
			}
		},
		//easeInOutBounce(t, b, c, d) {
		//	if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b; //	return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b; //}
	}
};
