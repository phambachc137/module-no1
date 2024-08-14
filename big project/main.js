const canvas= document.querySelector('canvas')
const context=canvas.getContext('2d')

const scoreEL=document.querySelector('#scoreEL')
canvas.height=innerHeight
canvas.width=innerWidth

class Boundary{
    static width =40
    static height=40
    constructor ({position,image}) {
        this.position=position
        this.width=40
        this.height=40
        this.image=image
    }
    draw(){
        //context.fillStyle="blue"
        //context.fillRect(this.position.x, this.position.y, this.width, this.height)
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}
class Player{
    constructor({position,velocity}) {
        this.position=position
        this.velocity=velocity
        this.radius=15
    }
    draw(){
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius,0,Math.PI*2)
        context.fillStyle='yellow'
        context.fill()
        context.closePath()
    }
    update(){
        this.draw()
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
    }
}

class Ghost{
    static speed =1
    constructor({position,velocity,color='red'}) {
        this.position=position
        this.velocity=velocity
        this.radius=15
        this.color= color
        this.prevCollisions=[]
        this.speed=1
    }
    draw(){
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius,0,Math.PI*2)
        context.fillStyle=this.color
        context.fill()
        context.closePath()
    }
    update(){
        this.draw()
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
    }
}

class Pellet{
    constructor({position}) {
        this.position=position
        this.radius=4
    }
    draw(){
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius,0,Math.PI*2)
        context.fillStyle="pink"
        context.fill()
        context.closePath()
    }
}

const Pellets=[]
const boundaries =[]
const ghost=[
    new Ghost({
    position:{
        x:Boundary.width*6+Boundary.width/2,
        y:Boundary.height+Boundary.height/2
    },
    velocity:{
        x:Ghost.speed,
        y:0
    },
    color:'red'
}),
    new Ghost({
        position:{
            x:Boundary.width*6+Boundary.width/2,
            y:Boundary.height*3+Boundary.height/2
        },
        velocity:{
            x:Ghost.speed,
            y:0
        },
        color:'blue'
    }),
    new Ghost({
        position:{
            x:Boundary.width*3+Boundary.width/2,
            y:Boundary.height*11+Boundary.height/2
        },
        velocity:{
            x:Ghost.speed,
            y:0
        },
        color:'green'
    })
]
const player =new Player({
    position:{
        x:Boundary.width+Boundary.width/2,
        y:Boundary.height+Boundary.height/2
    },
    velocity:{
        x:0,
        y:0
    }
})
const keys ={
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    }
}

let lastKey=''
let score=0

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src){
    const image =new Image()
    image.src=src
    return image
}

map.forEach((row,i)=>{// i= height
    row.forEach((symbol,j)=>{// j=width
        switch(symbol){
            case'-':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeHorizontal.png')
                    })
                );
                break
            case'|':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeVertical.png')
                    })
                );
                break
            case'1':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeCorner1.png')
                    })
                );
                break
            case'2':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeCorner2.png')
                    })
                );
                break
            case'3':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeCorner3.png')
                    })
                );
                break
            case'4':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeCorner4.png')
                    })
                );
                break
            case'b':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/block.png')
                    })
                );
                break
            case'[':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/capLeft.png')
                    })
                );
                break
            case']':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/capRight.png')
                    })
                );
                break
            case'_':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/capBottom.png')
                    })
                );
                break
            case'^':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/capTop.png')
                    })
                );
                break
            case'+':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeCross.png')
                    })
                );
                break
            case'5':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeConnectorTop.png')
                    })
                );
                break
            case'7':
                boundaries.push(new Boundary({
                        position:{
                            x: Boundary.width *j,
                            y: Boundary.height*i
                        },
                        image:createImage('./image/pipeConnectorBottom.png')
                    })
                );
                break
            case'.':
                Pellets.push(new Pellet({
                        position:{
                            x: j*Boundary.width+Boundary.width/2,
                            y: i*Boundary.height+Boundary.height/2,
                        },
                    })
                );
                break

        }
    })
})

function circleCollideWithRectangle({circle,rectangle}){
    const padding =Boundary.width/2-circle.radius-1
    return (circle.position.y-circle.radius+circle.velocity.y<=rectangle.position.y+rectangle.height+padding// top nv
        && circle.position.x+circle.radius+ circle.velocity.x >= rectangle.position.x-padding // right side
        && circle.position.y+circle.radius+circle.velocity.y >= rectangle.position.y-padding // under
        && circle.position.x-circle.radius+circle.velocity.x <= rectangle.position.x+rectangle.width+padding)
}
let animationId
function animate () {// infinit loop
    animationId=requestAnimationFrame(animate)
    context.clearRect(0,0,canvas.width,canvas.height)
    if(keys.w.pressed && lastKey==='w' ){// di chuyển 4 hướng, di chuyển mượt ko bị khựng
        for (let i = 0; i <boundaries.length ; i++) {
            const boundary=boundaries[i]
            if (circleCollideWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -5
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -5
            }
        }
    }else if(keys.a.pressed && lastKey==='a'){
        for (let i = 0; i <boundaries.length ; i++) {
            const boundary=boundaries[i]
            if (circleCollideWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -5,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }
    }else if(keys.s.pressed && lastKey==='s'){
        for (let i = 0; i <boundaries.length ; i++) {
            const boundary=boundaries[i]
            if (circleCollideWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 5
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    }else if(keys.d.pressed && lastKey==='d'){
        for (let i = 0; i <boundaries.length ; i++) {
            const boundary=boundaries[i]
            if (circleCollideWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 5,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }


    for (let i = Pellets.length-1; 0 <i ; i--) {// hạt biến mất khi nv đi qua
        const Pellet=Pellets[i]
        Pellet.draw()
        if(Math.hypot(Pellet.position.x-player.position.x,Pellet.position.y-player.position.y)<Pellet.radius+player.radius){
            Pellets.splice(i,1)
            score+=10//giá trị let score ở background
            scoreEL.innerHTML=score// truyền giá trị score ở background ra ScoreEL trưng ra khai báo sẵn ở html
        }
    }


    boundaries.forEach((boundary) => {
        boundary.draw()

        if(
            circleCollideWithRectangle({
                circle: player,
                rectangle:boundary
            })
        ){

            player.velocity.x=0
            player.velocity.y=0
        }
    })

    player.update()// dòng 97
    ghost.forEach(ghost=>{
        ghost.update()
        if(Math.hypot(ghost.position.x-player.position.x,ghost.position.y-player.position.y)<ghost.radius+player.radius){
            cancelAnimationFrame(animationId)
            console.log('u pathetic')
        }// lúc nv vs ghost va chạm
        const collisions=[]//ghost nhận bt tường
        boundaries.forEach(boundary=>{//từng image hộp nhỏ trong biên giới hộp to
            if (!collisions.includes('right')&&circleCollideWithRectangle({//(!): mang nghĩa phủ định. khi ghost chạm biên giới mà ko có right thì push(dòng 433)
                circle: {
                    ...ghost, velocity: {
                        x: ghost.speed,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ){
              collisions.push('right')
            }
            if (!collisions.includes('left')&&circleCollideWithRectangle({
                circle: {
                    ...ghost, velocity: {
                        x: -ghost.speed,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ){
                collisions.push('left')
            }
            if (!collisions.includes('up')&&circleCollideWithRectangle({
                circle: {
                    ...ghost, velocity: {
                        x: 0,
                        y: -ghost.speed
                    }
                },
                rectangle: boundary
            })
            ){
                collisions.push('up')
            }
            if (!collisions.includes('down')&&circleCollideWithRectangle({
                circle: {
                    ...ghost, velocity: {
                        x: 0,
                        y: ghost.speed
                    }
                },
                rectangle: boundary
            })
            ){
                collisions.push('down')
            }
        })
        if(collisions.length>ghost.prevCollisions.length)// ghost tiên toán lối rẽ(xác định tường hổng)
        ghost.prevCollisions=collisions
        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){//JSON: dự liệu lưu trữ thông tin nhỏ nhẹ cho máy tính
            console.log(collisions)

            console.log(collisions)
            console.log(ghost.prevCollisions)
            if(ghost.velocity.y>0)ghost.prevCollisions.push('right')
            else if(ghost.velocity.x<0)ghost.prevCollisions.push('left')
            else if(ghost.velocity.y<0)ghost.prevCollisions.push('up')
            else if(ghost.velocity.y>0)ghost.prevCollisions.push('down')//xác định những lối có thể đi

            const pathways= ghost.prevCollisions.filter((collision)=>{
                return !collisions.includes(collision)
            })
            console.log({pathways})

            const direction=pathways[Math.floor(Math.random()*pathways.length)]//pick bừa 1 đg

            switch (direction){// ghost auto move
                case 'down':
                    ghost.velocity.x=0
                    ghost.velocity.y=ghost.speed
                    break
                case 'up':
                    ghost.velocity.x=0
                    ghost.velocity.y=-ghost.speed
                    break
                case 'right':
                    ghost.velocity.x=ghost.speed
                    ghost.velocity.y=0
                    break
                case 'left':
                    ghost.velocity.x=-ghost.speed
                    ghost.velocity.y=0
                    break
            }

            ghost.prevCollisions=[]// reset toàn bộ phần trên, ghost sẽ di chuyển vs đôi hướng khi chạm tường
        }
        //
    })
}

animate()
// xác định giá trị nút chỉ định
window.addEventListener('keydown',({key})=>{// khi nhấn nút
    switch (key){
        case 'w':
            keys.w.pressed = true
            lastKey='w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey='a'
            break
        case 's':
            keys.s.pressed = true
            lastKey='s'
            break
        case 'd':
            keys.d.pressed = true
            lastKey='d'
            break
    }

})
window.addEventListener('keyup',({key})=>{// khi thả nút
    switch (key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
    }

})