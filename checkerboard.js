function createCheckerboard(checkerboardElement){
    checkerboardElement.innerHTML = ''
    for(let i = 0; i < 8; i++){
        let row = document.createElement('div')
        row.classList.add('row')

        const isEvenRow = (i % 2 === 0)

        for(let j = 0; j < 8; j++){
            let cell = document.createElement('div')
            cell.classList.add('cell')
            let cellNumber;
            if(isEvenRow){
                cellNumber = (i * 8 + j + 1)
            }
            else{
                cellNumber = (i * 8 + (8 - j))
            }
            cell.position = cellNumber

            let cellText = document.createElement('p')
            cellText.textContent = cellNumber
            cell.appendChild(cellText)

            // Add Arrow
            let direction = ''
            if (isEvenRow) {
                if (j < 7) direction = 'right'
                else if (i < 7) direction = 'down'
            } else {
                if (j > 0) direction = 'left'
                else if (i < 7) direction = 'down'
            }

            if (direction) {
                let arrow = document.createElement('div')
                arrow.classList.add('arrow', direction)
                cell.appendChild(arrow)
            }

            row.appendChild(cell)
        }
        checkerboardElement.appendChild(row)
    }
}

function movePiece(who, playerPosition, diceNum){
    // 计算目标位置，确保不超过64
    const targetPosition = Math.min(playerPosition + diceNum, 64)
    let currentPosition = playerPosition
    // 创建棋子图片元素
    const pieceImg = document.createElement('img')
    pieceImg.classList.add('piece-img')
    pieceImg.src = who ? './img/男性棋子.png' : './img/女性棋子.png'
    // 3. 移动到指定格子的函数
    function moveToNext(position){
        const cell = getCellByPosition(position - 1) //当前格
        const nextcell = getCellByPosition(position) //下一格
        if(!cell) return      
        // 移除该格子中已有的同类型棋子
        const existingPiece = cell.querySelector(`.piece-img.${who ? 'boy-piece' : 'girl-piece'}`)
        if(existingPiece){
            existingPiece.remove()
        }    
        // 添加棋子到新格子
        pieceImg.classList.add(who ? 'boy-piece' : 'girl-piece')
        nextcell.appendChild(pieceImg)
    }  
    // 4. 动画函数（递归 + setTimeout）
    function animate(){
        if(currentPosition >= targetPosition){
            return  // 到达目标位置，停止
        }       
        currentPosition++  // 移动到下一格
        moveToNext(currentPosition)  // 执行移动
        
        setTimeout(animate, 500)  // 500ms 后继续移动
    }
    
    animate()  // 开始动画
}

function getCellByPosition(position){
    const cells = document.querySelectorAll('.cell')
    for(let cell of cells){
        if(cell.position === position){
            return cell
        }
    }
    return null
}

function initPieces(){
    const boyCell = getCellByPosition(1)
    const girlCell = getCellByPosition(1)
    // 初始化男性棋子
    const boyPiece = document.createElement('img')
    boyPiece.classList.add('piece-img', 'boy-piece')
    boyPiece.src = './img/男性棋子.png'
    boyCell.appendChild(boyPiece)
    // 初始化女性棋子
    const girlPiece = document.createElement('img')
    girlPiece.classList.add('piece-img', 'girl-piece')
    girlPiece.src = './img/女性棋子.png'
    girlCell.appendChild(girlPiece)
}

function backMove(who, playerPosition, diceNum)
{
    const targetPosition = Math.max(playerPosition - diceNum, 1)
    let currentPosition = playerPosition
    // 创建棋子图片元素
    const pieceImg = document.createElement('img')
    pieceImg.classList.add('piece-img')
    pieceImg.src = who ? './img/男性棋子.png' : './img/女性棋子.png'
    // 3. 移动到指定格子的函数
    function moveToNext(position){
        const cell = getCellByPosition(position + 1) //当前格
        const nextcell = getCellByPosition(position) //上一格
        if(!cell) return      
        // 移除该格子中已有的同类型棋子
        const existingPiece = cell.querySelector(`.piece-img.${who ? 'boy-piece' : 'girl-piece'}`)
        if(existingPiece){
            existingPiece.remove()
        }    
        // 添加棋子到新格子
        pieceImg.classList.add(who ? 'boy-piece' : 'girl-piece')
        nextcell.appendChild(pieceImg)
    }  
    // 4. 动画函数（递归 + setTimeout）
    function animate(){
        if(currentPosition <= targetPosition){
            return  // 到达目标位置，停止
        }       
        currentPosition--  // 回退到上一格
        moveToNext(currentPosition)  // 执行移动
        
        setTimeout(animate, 300)  // 300ms 后继续移动
    }
    
    animate()  // 开始动画
}

function RemovePiece(){
    const cells = document.querySelectorAll('.cell')
    for(let cell of cells){
        if(cell.querySelector('.piece-img')){
            cell.querySelector('.piece-img').remove()
        }
    }
}