const{ createApp } = Vue
    
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
            showTaskWindow: false
        }
    },
    mounted(){
        this.checkerboard = document.getElementById('checkerboard')
        if( typeof createCheckerboard === 'function' ){
            createCheckerboard(this.checkerboard)
        }
        this.WhoRound()
        initPieces()
    },
    methods:{
        rollDice(){
             // 掷骰子，随机生成1-6的整数
            this.diceNum = Math.floor(Math.random() * 6) + 1    
            this.diceNum = 60       
            // 移动棋子
            setTimeout(() => {
                this.MovePiece()
                this.movePlayer()
                setTimeout(() => {
                    this.RandomTask()
                }, 1000)
                //this.diceNum*500)
            }, 1000)
        },
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
            const response = await fetch('./tasks/tasks.json') 
            const data = await response.json()
            const tasks = await data.tasks
            const randomTask = tasks[Math.floor(Math.random() * tasks.length)]
            this.task = randomTask
            this.showTaskWindow = true
            console.log(randomTask)
        },
        acceptTask(){
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
        restartGame(){
            this.diceNum = 0
            this.boyposition = 1
            this.girlposition = 1
            this.boyWin = false
            this.girlWin = false
            this.gameOver = false
            this.winner = ''
            this.gameRound = 0
            this.exchangeRound = true
            this.task = '你抽到的任务是:'
            this.showTaskWindow = false
            RemovePiece()
            initPieces()
        }
    }
})

app.mount('#main')
