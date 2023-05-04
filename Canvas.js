

class CanvasData{
    pointRadius = 10
    gridCellSize = new Vector2(this.pointRadius*2, this.pointRadius*2)
    points = 0

    constructor(canvas, scale=10, height=400){
        // Setup
        this.canvas = canvas
        let ctx = canvas.getContext('2d')
        this.redraw([], scale, height)

        // Draw points on click
        let t = this
        this.canvas.addEventListener('mousedown', function(e) {
            t.drawPoint(e.offsetX, e.offsetY)
        })
    }

    redraw(points, scale, height){
        if(scale) this.pointRadius = scale
        if(height) this.canvas.height= height
        
        let ctx = canvas.getContext("2d")
        this.canvas.width = 600
        this.gridCellSize = new Vector2(this.pointRadius*2, this.pointRadius*2)
        this.points = 0

        // Background
        ctx.fillStyle = "#EEEEEE"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Grid
        for(let x=0; x<canvas.width/this.gridCellSize.x; x++){
            let col = x*this.gridCellSize.x
            this.drawLine(col, 0, col, canvas.height)
        }
        for(let y=canvas.height/this.gridCellSize.y-1; y>=0; y--){
            let row = y*this.gridCellSize.y
            this.drawLine(0, row, canvas.width, row)
        }
        
        // Points
        for(let p in points){
            let pos = this.formatInputPoint(points[p].x, points[p].y)
            this.drawPoint(pos.x, pos.y)
        }
    }

    drawPoint(x, y){
        // Circle
        let ctx = canvas.getContext("2d")
        ctx.beginPath();
        ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#111111"
        ctx.stroke();

        // Label
        let fontSize = this.pointRadius.toString()
        ctx.font = fontSize+"px Arial";
        ctx.fillStyle = "#111111";
        ctx.fillText(this.points.toString(), x-fontSize*0.25, y+fontSize*0.25);
        
        this.points++
        console.debug("DrawPoint: ", x,y)
    }

    drawLine(x1,y1, x2,y2){
        let ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.strokeStyle = "#e4e4e4"
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    formatOutputPoint(x, y){
        // Match positions with grid size for previewing
        x = x/this.pointRadius/2
        y = (this.canvas.height - y)/this.pointRadius/2
        return new Vector2(x,y)
    }

    formatInputPoint(x, y){
        // Match previewing size with grid size
        x = x*this.pointRadius*2
        y = this.canvas.height - y*this.pointRadius*2
        return new Vector2(x,y)
    }
}
