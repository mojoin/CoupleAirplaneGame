const{ createApp } = Vue

// 防抖函数
function debounce(func, delay){
    let timer = null
    return function(){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, arguments)
        }, delay)
    }
}
// vue实例
const app = createApp({
    data(){
        return{
            checkerboard: null,
            diceNum: 0,
            boyposition: 1,
            girlposition: 1,
            boyWin: false,
            girlWin: false,
            gameOver: false,
            winner: '',
            gameRound: 0,
            exchangeRound: true,
            task: '你抽到的任务是:',
            showTaskWindow: false,
            level:'',
            showLevel: true,
            turnAction: false,      //回合正在进行中
        }   
    },
    
    mounted(){
        selectLevel(this)
        this.checkerboard = document.getElementById('checkerboard')
        if( typeof createCheckerboard === 'function' ){
            createCheckerboard(this.checkerboard)
        }
        this.WhoRound() 
        initPieces()
    },
    methods:{
        rollDice: debounce(function(){
            // 回合正在进行中
            this.turnAction = true
            // 掷骰子，随机生成1-6的整数
            this.diceNum = Math.floor(Math.random() * 6) + 1        
            // 移动棋子
            setTimeout(() => {
                this.MovePiece()
                this.movePlayer()
                setTimeout(() => {
                    this.RandomTask()
                }, this.diceNum*500)
                //)
            }, 1000)
        }, 500),
        WhoRound(){
            // 随机生成0或1，0表示男孩先掷骰子，1表示女孩先掷骰子
            this.exchangeRound = Math.floor(Math.random() * 2)
        },
        movePlayer(){
            // 移动玩家
            if(this.exchangeRound){
                // 男孩回合
                this.boyposition += this.diceNum
            }
            else{
                // 女孩回合
                this.girlposition += this.diceNum
            }
        },
        MovePiece(){
            if(this.exchangeRound){
                // 移动男生棋子
                movePiece(this.exchangeRound, this.boyposition, this.diceNum)
            }
            else{
                // 移动女生棋子
                movePiece(this.exchangeRound, this.girlposition, this.diceNum)
            }
        },
        async RandomTask(){
            // const response = await fetch('./tasks/tasks.json') 
            // const data = await response.json()
            // const tasks = await data.tasks
            const tasks = window.selectedMode.tasks
            const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
            this.task = randomTask
            this.showTaskWindow = true
            console.log(randomTask)
        },
        // async SelectingLevel(){
        //     const response = await fetch('./tasks/tasks.json') 
        //     const data = await response.json()
        //     //const level = await data.
        //     const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
        //     this.task = randomTask
        //     this.showTaskWindow = true
        //     console.log(randomTask)
        // },
        acceptTask(){
            this.turnAction = false     // 回合结束
            this.showTaskWindow = false
            if(this.exchangeRound && this.boyposition >= 64){
                this.boyWin = true
                this.winner = '男孩'
                this.gameOver = true
                this.gameOverText = '男孩赢了！'
            }
            else if(!this.exchangeRound && this.girlposition >= 64){
                this.girlWin = true
                this.winner = '女孩'
                this.gameOver = true
                this.gameOverText = '女孩赢了！'
            }
            this.exchangeRound = !this.exchangeRound
        },
        rejectTask(){
            this.turnAction = false     // 回合结束
            console.log("拒绝了任务")
            if(this.exchangeRound){
                backMove(this.exchangeRound, this.boyposition, this.diceNum)
                this.boyposition -= this.diceNum
            }
            else{
                backMove(this.exchangeRound, this.girlposition, this.diceNum)
                this.girlposition -= this.diceNum
            }
            this.showTaskWindow = false
            this.exchangeRound = !this.exchangeRound
        },
        // restartGame(){
        //     this.diceNum = 0
        //     this.boyposition = 1
        //     this.girlposition = 1
        //     this.boyWin = false
        //     this.girlWin = false
        //     this.gameOver = false
        //     this.winner = ''
        //     this.gameRound = 0
        //     this.exchangeRound = true
        //     this.task = '你抽到的任务是:'
        //     this.showTaskWindow = false
        //     RemovePiece()
        //     initPieces()
        // },
        exchangeTurn(){
            this.showLevel = !this.showLevel    // 切换模式时，显示等级选择窗口
            this.restartGame()
        },
        restartGame: debounce(function(){
            this.diceNum = 0              // ✅ 骰子点数
            this.boyposition = 1          // ✅ 男孩位置
            this.girlposition = 1         // ✅ 女孩位置
            this.boyWin = false           // ✅ 男孩胜利状态
            this.girlWin = false          // ✅ 女孩胜利状态
            this.gameOver = false         // ✅ 游戏结束状态
            this.winner = ''              // ✅ 获胜者
            this.gameRound = 0            // ✅ 游戏回合数
            this.exchangeRound = true     // ✅ 当前回合
            this.task = '你抽到的任务是:'   // ✅ 任务文本
            this.showTaskWindow = false   // ✅ 任务窗口显示状态
            RemovePiece()                 // ✅ 移除棋子
            initPieces()                  // ✅ 初始化棋子
        }, 500),
    }
})

app.mount('#main')
