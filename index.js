const gameBoard = document.querySelector("#gameBoard");
const digits = document.querySelector("#digits");
let lastSelected = null;
const deleteNum = document.querySelector("#delete");
let error = 0;
const mistake = document.querySelector("#mistake");

const puzzel = [
    "53--7----",
    "6--195---",
    "-98----6-",
    "8---6---3",
    "4--8-3--1",
    "7---2---6",
    "-6----28-",
    "---419--5",
    "----8--79"
];

const solution = [
  "534678912",
  "672195348",
  "198342567",
  "859761423",
  "426853791",
  "713924856",
  "961537284",
  "287419635",
  "345286179"
];

window.onload = (() => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const div = document.createElement("div");
            div.classList.add("tile");
            div.addEventListener("click", selectTile);
            div.setAttribute("row", i);
            div.setAttribute("col", j);

            if (puzzel[i][j] != "-") {
                div.innerText = puzzel[i][j];
                div.classList.add("filled");
            }

            if (i == 2 || i == 5) {
                div.classList.add("border-bottom");
            }

            if (j == 2 || j == 5) {
                div.classList.add("border-right");
            }

            gameBoard.appendChild(div);
        }
    }

    for (let i = 0; i < 9; i++) {
        const div = document.createElement("div");
        div.classList.add("tile");
        div.addEventListener("click", addNumber);
        div.innerText = i + 1;
        div.style.height = gameBoard.querySelector(".tile").clientHeight + "px";
        digits.appendChild(div);
    }
});

function selectTile() {
    // Reset all highlight classes
    const allTiles = document.querySelectorAll(".tile");
    allTiles.forEach(tile => {
        tile.classList.remove("select-tile", "related-tile", "same-number");
    });

    lastSelected = this;
    lastSelected.classList.add("select-tile");

    const selectedRow = parseInt(lastSelected.getAttribute("row"));
    const selectedCol = parseInt(lastSelected.getAttribute("col"));
    const selectedValue = lastSelected.innerText;

    allTiles.forEach(tile => {
        const row = parseInt(tile.getAttribute("row"));
        const col = parseInt(tile.getAttribute("col"));

        // Highlight row, col, and grid
        const sameRowOrCol = row === selectedRow || col === selectedCol;
        const sameBox =
            Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
            Math.floor(col / 3) === Math.floor(selectedCol / 3);

        if (sameRowOrCol || sameBox) {
            tile.classList.add("related-tile");
        }

        // Highlight same numbers
        if (selectedValue !== "" && tile.innerText === selectedValue) {
            tile.classList.add("same-number");
        }
    });
}

function addNumber() {
    if (lastSelected.innerText == "" || lastSelected.classList.contains("danger")) {
        lastSelected.innerText = this.innerText;
    }

    let row = lastSelected.getAttribute("row");
    let col = lastSelected.getAttribute("col");

    if (solution[row][col] == lastSelected.innerText) {
        lastSelected.classList.remove("danger");
    } else {
        lastSelected.classList.add("danger");
        addErrorAndDisplay();
    }

    if (isAllTilesFilled()) {
        const allTiles = gameBoard.querySelectorAll(".tile");
        let userAnswer = [...allTiles].map((tile) => tile.innerText);
        let num = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (solution[i][j] != userAnswer[num]) {
                    allTiles[num].classList.add("danger");
                }
                num++;
            }
        }

        // ✅ FIXED TYPO: changed "dander" to "danger"
        let dangerClass = [...allTiles].some((tile) => {
            return tile.classList.contains("danger");
        });

        if (!dangerClass) {
        //     if (error > 2) {
        //         alert("You Lost!");
        //         location.reload();
        //     }
        // } else {
            alert("Congratulations! You win the puzzle!");
        }
    }
}

deleteNum.onclick = () => {
    if (!lastSelected.classList.contains("filled")) {
        lastSelected.innerText = "";
    }
};

function addErrorAndDisplay() {
    error++;
    mistake.innerText = error;
    if(error > 2){
        alert("You Lost!");
        location.reload();
    }
}

function isAllTilesFilled() {
    const allTiles = gameBoard.querySelectorAll(".tile");
    return [...allTiles].every((tile) => tile.innerText != "");
}
