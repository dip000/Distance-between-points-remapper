

	class Vector2{
		constructor(x=0, y=0){
			this.x = x
			this.y = y
		}
		get length(){
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
		}

		equalTo(vector){
			return (this.x == vector.x) &&  (this.y == vector.y)
		}
		
		distanceTo(vector){
			return (new Vector2(this.x - vector.x, this.y - vector.y)).length
		}

		rotate(angleDegrees){
			// Cartesian to polar to add the angle
			let angleRadians = angleDegrees * (Math.PI/180.0)
			angleRadians += Math.atan2(this.y, this.x)
			
			// Polar to cartesian
			let radius = this.length
			this.x = radius * Math.cos(angleRadians);
			this.y = radius * Math.sin(angleRadians);
			return this
		}
	}


	class Circle{
		constructor(center, radius){
			this.h = center.x
			this.k = center.y
			this.r = radius
		}

		intersectWithCircle(c2){
			// Rename for something more readable
			let {h1, k1, r1, h2, k2, r2} = {h1:this.h, k1:this.k, r1:this.r, h2:c2.h, k2:c2.k, r2:c2.r}
			console.debug(`h1=${h1}, k1=${k1}, r1=${r1}, h2=${h2}, k2=${k2}, r2=${r2}`)
			

			// Using the equalization method for two circle equations
			// Broken down from: (x-h1)^2 + (y-k1)^2 - r1^2 = (x-h2)^2 + (y-k2)^2 - r2^2
			// Solving for 'x' and sepparated as a linear equation: y=mx+b
			let divisor = (-2*k1+2*k2) !=0 ? (-2*k1+2*k2) : 0.000001 //avoid division by zero :D
			let m = (-2*h2+2*h1) / divisor
			let b = (h2*h2 + k2*k2 - h1*h1 - k1*k1 + r1*r1 - r2*r2) / divisor
			let y_solver=(x)=> m*x + b
			console.debug(`${m}x + ${b}`);


			// Broken down from: (x-h1)^2 + (y-k1)^2 - r1^2 = 0
			// Replacing 'y' as the previously simplified equation 'y_solver'
			// Solving for 'x' and sepparated as a quadratic equation: y=Ax^2 + Bx + C
			let A = 1 + m*m
			let B = 2*m*b - 2*k1*m - 2*h1
			let C = h1*h1 + b*b - 2*b*k1 + k1*k1 - r1*r1
			console.debug(`${A}x^2 + ${B}x + ${C}`);
			

			// Solve 'x' and Find 'y' using knwn 'x'
			let {x1, x2} = solveQuardaticEquation(A, B ,C)
			let y1 = y_solver(x1)
			let y2 = y_solver(x2)

			// Round because of precision errors, and the division by zero fix
			x1 = parseFloat(x1.toFixed(3))
			x2 = parseFloat(x2.toFixed(3))
			y1 = parseFloat(y1.toFixed(3))
			y2 = parseFloat(y2.toFixed(3))
			console.debug(`Root1(${x1}, ${y1});  Root2(${x2}, ${y2})`);
			
			return [new Vector2(x1, y1), new Vector2(x2, y2)]
		}
	}

	// y = ax^2 + bx + c
	// x = (-b +- sqrt(b^2 - 4ac)) / 2a
	function solveQuardaticEquation(a, b, c){
		let dividend_left = -b
		let dividend_right = Math.sqrt(b*b - 4*a*c)
		let divisor = 2*a
		
		let x1 = (dividend_left + dividend_right) / divisor
		let x2 = (dividend_left - dividend_right) / divisor
		
		return {x1, x2}
	}


	function randomColor(){
		return 'rgb('+(random(200)+55)+','+(random(100)+50)+','+(random(100)+50)+')'
	}
	function random(number){
		return Math.floor(Math.random()*number)
	}

	function nth_triangular_inverse(n){
		//y = (1/2)n^2 + (1/2)n + (-t)
		let sol = solveQuardaticEquation(1/2, 1/2, -n)
		if(sol.x1 > 0) return sol.x1
		else return sol.x2
	}
	
	// Like factorial but with sums
	function nth_triangular(n){
		return ( n * ( n + 1 ) / 2 )
	}
	