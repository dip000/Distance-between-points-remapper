

class PointsData{
    constructor(){
        this.points = []
        this.distances = []
        this.globalPosition = new Vector2(0, 0)
        this.globalRotation = 0
    }

    add(x, y){
        if(this.points.length == 0)
            this.globalPosition = new Vector2(x.toFixed(1), y.toFixed(1))

        this.points.push(new Vector2(x, y))
        this.calculateDistancesFromPoints()
    }

    remapPointsFromDistances(mirror_root=1){
        if(this.distances.length <= 0) return
        this.points = []

        // Every consecutive point will be based off of these two points,
        // so they can decide the global position and rotation of the remapped points.
        this.points[0] = this.globalPosition
        this.points[1] = new Vector2(this.distances[0][1]+this.globalPosition.x, this.globalPosition.y)
        this.points[1].rotate( this.globalRotation )
        if(this.distances.length <= 2) return

        // Intersections of all posible directions around a point, are the places where all distances matches all of the known references
        let two_referencedByZero = new Circle(this.points[0], this.distances[2][0])
        let two_referencedByOne = new Circle(this.points[1], this.distances[2][1])
        this.points[2] = two_referencedByZero.intersectWithCircle( two_referencedByOne )[mirror_root] //result might end up mirrored depending on the root used

        
        // Exact mapping 
        for(let n=3; n<this.distances[0].length; n++){
            // 2 Circles can create only 1 pair of intersecting points or roots. And its not enough to determine a position
            // 3 Circles can create up to 3 combinations of pair-roots. Enough to determine a position
            let n_referencedByZero = new Circle(this.points[0], this.distances[n][0])
            let n_referencedByOne = new Circle(this.points[1], this.distances[n][1])
            let n_referencedByTwo = new Circle(this.points[2], this.distances[n][2])

            // Check for more intersections for more reliability or let it be the bare minimum of 2
            rootsZeroOne = n_referencedByZero.intersectWithCircle( n_referencedByOne )
            rootsZeroTwo = n_referencedByZero.intersectWithCircle( n_referencedByTwo )

            if( rootsZeroOne[0].equalTo(rootsZeroTwo[0]) || rootsZeroOne[0].equalTo(rootsZeroTwo[1]) ){
                this.points[n] = rootsZeroOne[0]
            }
            else if( rootsZeroOne[1].equalTo(rootsZeroTwo[0]) || rootsZeroOne[1].equalTo(rootsZeroTwo[1]) ){
                this.points[n] = rootsZeroOne[1]
            }
        }
    }

    // Takes an Array[Vector2] describing the positions of 'points' in 2D
    // Returns a squared symmetrical matrix of 'distances' describing "direction of point0 to point1 is 123.4m"
    // This simulates the Wi-Fi RTT functionality of ESP32. Because the ESP32 cannot know the direction of another device, just the distance in between
    calculateDistancesFromPoints(){
        this.distances = []
        for(let i in this.points){
            this.distances[i] = []
            for(let j in this.points){
            this.distances[i].push( this.points[i].distanceTo(this.points[j]) )
            }
        }
    }

    parseOutputFromDistances(){
        let outStr = ""
        outStr += `GPos:\t${this.globalPosition.x}, ${this.globalPosition.y}\n`
        outStr += `GRot:\t${this.globalRotation}\n`

        for(let i=0; i<this.distances[0].length; i++){
            for(let j=i+1; j<this.distances[0].length; j++){
                outStr += `${i}->${j}:\t${this.distances[i][j].toFixed(3)}\n`
            }
        }
        return outStr
    }

    parseDistancesFromOutput(outStr){
        outStr = outStr.trim().split("\n")
        if(outStr.length <= 2) return []

        // Parse global info
        let parsedGlobalPos = outStr[0].slice(6).split(", ")
        let parsedGlobalRot= outStr[1].slice(6)
        this.globalPosition.x = parseFloat( parsedGlobalPos[0] )
        this.globalPosition.y = parseFloat( parsedGlobalPos[1] )
        this.globalRotation =parseFloat( parsedGlobalRot[1] )
        outStr = outStr.splice(2)

        // How many 2D points represents 'n' distance measurements
        let size = nth_triangular_inverse(outStr.length) + 1
        if(!Number.isInteger(size)) return []
        this.distances = [...Array(size)].map(e => Array(size).fill(0))

        // Parse distances
        for(let i in outStr){
            let splices = outStr[i].split("->")
            let from = parseInt(splices[0])

            splices = splices[1].split(":\t")
            let to = parseInt(splices[0])
            let distance = parseFloat(splices[1])

            // Recreate a squared symmetrical matrix of 'distances'
            console.debug(`${from}->${to}:\t${distance}\n`)
            this.distances[from][to] = distance
            this.distances[to][from] = distance
        }
    }

}


