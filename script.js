let cart = [];
let lastAddedProduct = null;0

const payButton = document.querySelector(".pay");
const paymentPopup = document.getElementById("paymant");

const paymantUnitValue = document.getElementById("paymant-unit-value");
const paymantPriceValue = document.getElementById("paymant-price-value");

const cashInput = document.getElementById("cashInput");
const changeValue = document.getElementById("change-value");

const input = document.getElementById("productInput");
const addbox = document.getElementById("addProduct_box");

const unitDisplay = document.querySelector(".unit div:nth-child(2)");
const priceDisplay = document.querySelector(".price div:nth-child(2)");

//-------สร้างรายการสินค้าแบบ icon -----------------------
const products = [
    { name: "ช้างป๋องเล็ก", price: 35, img: "img/ช้างสั้น.png" },
    { name: "ช้างป๋องยาว", price: 50, img: "img/ช้างยาว.png" },
    { name: "ช้าง", price: 58, img: "img/ช้างขวด.png" },
    { name: "ลีโอป๋องเล็ก", price: 36, img: "img/ลีโอสั้น.png" },
    { name: "ลีโอป๋องยาว", price: 50, img: "img/ลีโอยาว.png" },
    { name: "ลีโอ", price: 60, img: "img/ลีโอขวด.png" },
    { name: "สิงห์ป๋องเล็ก", price: 38, img: "img/สิงห์สั้น.png" },
    { name: "สิงห์ป๋องยาว", price: 55, img: "img/สิงห์ยาว.png" },
    { name: "สิงห์", price: 65, img: "img/สิงห์ขวด.png" },
    { name: "น้ำแข็ง", price: 5, img: "img/น้ำแข็ง.png" },
    { name: "น้ำมันขวด", price: 40, img: "img/น้ำมันขวด.png" },
    { name: "ไข่ไก่", price: 5, img: "img/ไข่ไก่.png" }
];

function renderProducts() {
    const container = document.querySelector(".noncode-product");
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "manu-product";
        productDiv.setAttribute("data-name", product.name);
        productDiv.setAttribute("data-price", product.price);

        productDiv.innerHTML = `
            <div><img src="${product.img}" alt=""></div>
            <div>฿${product.price.toFixed(2)}</div>
        `;

        container.appendChild(productDiv);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    renderProducts();
});



// -------------------สร้างเสียงพูด---------------------------------------------------------------------
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    speechSynthesis.speak(utterance);
}

// -------------------สร้างเสียงพูด---------------------------------------------------------------------

//------------------สร้างหน่วงเวลา-------------------------------------------------------------------
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

//------------------สร้างหน่วงเวลา-------------------------------------------------------------------

//-------------------สร้างนาฬิกา------------------------------------------------------
function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('time').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();
//-------------------สร้างนาฬิกา------------------------------------------------------

//--------------เปิดหน้าเว็ป focus ช่องกรอกรหัสสินค้า--------------------------------------
window.addEventListener("DOMContentLoaded", function () {
    input.focus();
});

//------------------กด . เพื่อ focus input ---------------------------------
document.addEventListener("keydown", function (event) {
    if (event.code === "NumpadDecimal") {
        event.preventDefault();
        input.focus();
        paymentPopup.style.display = "none";
    }
});
//------------------กด . เพื่อ focus input ---------------------------------

//------------------กดปุ่ม+เพื่อเรียก pop up ชำระสินค้าขึ้นมา---------------------------------
document.addEventListener("keydown", function (event) {
    if (event.code === 'NumpadAdd') {
        event.preventDefault();

        const popupDisplay = window.getComputedStyle(paymentPopup).display;

        if (popupDisplay === "none") {
            paymentPopup.style.display = "block";
        } else {
            paymentPopup.style.display = "none";
        }

        let totalQty = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            const qty = parseInt(item.qtyInput.value);
            totalQty += qty;
            totalPrice += item.getTotal();
        });

        paymantUnitValue.innerText = `${totalQty} รายการ`;
        paymantPriceValue.innerText = `${totalPrice.toFixed(0)} บาท`;

        cashInput.focus();
        cashInput.value = "";

        if (!isNaN(totalPrice) && totalPrice > 0) {
            speak(`รวม${totalPrice} บาท`);
        }
    }
});
//------------------กดปุ่ม+เพื่อเรียก pop up ชำระสินค้าขึ้นมา---------------------------------



//---------------------Open to produceList.html----------------------------------
const productList = document.getElementById("productList");
productList.addEventListener("click", function () {
    window.location.href = "productList.html";
});

//--------------------open pop up สรุปยอดขาย----------------------------------------

const BTNSummarySales = document.getElementById("SummarySales");
const popupSummarySales = document.querySelector(".monitorTotalPrice-day");

BTNSummarySales.addEventListener("click", function () {
    if (popupSummarySales.style.display === "flex") {
        popupSummarySales.style.display = "none";
    } else {
        popupSummarySales.style.display = "flex";
        updateSalesSummary();
        setTimeout(function () {
            popupSummarySales.style.display = "none";
        }, 10000);
    }
});

//---------------------------inputproduct-----------------------------------------------------------
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (input.value.trim() === "") {
            if (lastAddedProduct) {
                let currentQty = parseInt(lastAddedProduct.qtyInput.value);
                currentQty += 1;
                lastAddedProduct.qtyInput.value = currentQty;


                const total = lastAddedProduct.price * currentQty;
                lastAddedProduct.totalValue.innerText = `${total.toFixed(0)} บาท`;

                updateSummary();
                speak(`${currentQty}`);
            } else {
                speak("ยังไม่มีสินค้า");
            }
            input.value = "";
            return;
        }
        const value = parseInt(input.value.trim());
        const code = input.value.trim();

        const foundProduct = productData.find(p => p.code === code);

        if (!isNaN(value) && value >= 1 && value <= 10000) {
            addProductbox(value);
            input.value = "";
        } else if (foundProduct) {
            addProductbox(foundProduct.price, foundProduct.name);
            input.value = "";
        } else {
            input.value = "";
            speak(`ไม่มี`);
        }
    }
});
//-------------------ช่องใส่รหัสสินค้า--------------------------------------------

//---------------กด + เพื่อเพิ่มจำนวนสินค้า----------------------------------
document.addEventListener("keydown", function (event) {
    if (event.code === "NumpadSubtract") {
        event.preventDefault();

        if (lastAddedProduct) {
            let currentQty = parseInt(lastAddedProduct.qtyInput.value);

            if (currentQty > 1) {
                currentQty -= 1;
                lastAddedProduct.qtyInput.value = currentQty;

                const total = lastAddedProduct.price * currentQty;
                lastAddedProduct.totalValue.innerText = `${total.toFixed(0)} บาท`;

                updateSummary();
                speak(`${currentQty}`);
            } else {
                const index = cart.indexOf(lastAddedProduct);
                if (index !== -1) {
                    cart.splice(index, 1);
                    lastAddedProduct.qtyInput.closest(".productbox").remove();
                    updateSummary();

                    lastAddedProduct = null;
                }
            }
        } else {
            speak("ยังไม่มีสินค้าในตะกร้า");
        }
    }
});
//---------------กด + เพื่อเพิ่มจำนวนสินค้า----------------------------------

//--------------------เพิ่มสินค้าลงในตะกร้า-----------------------------------------------------------------------------

function addProductbox(price, name = "สินค้าอื่นๆ") {
    const mainbox = document.createElement("div");
    mainbox.className = "addProduct";

    const itemRow = document.createElement("div");
    itemRow.innerHTML = `
        <div>${name}</div>
        <div>${price.toFixed(0)} บาท</div>
    `;
    const qtyRow = document.createElement("div");
    const qtyLabel = document.createElement("div");
    qtyLabel.innerText = "จำนวน";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.value = "1";
    qtyInput.min = "1";
    qtyInput.className = "qty-input";

    qtyRow.appendChild(qtyLabel);
    qtyRow.appendChild(qtyInput);

    const totalRow = document.createElement("div");
    const totalLabel = document.createElement("div");
    totalLabel.innerText = "ราคารวม";
    const totalValue = document.createElement("div");
    totalValue.innerText = `${price.toFixed()} บาท`;

    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);

    const productItem = {
        name: name,
        price: price,
        qtyInput: qtyInput,
        totalValue: totalValue,
        getTotal: function () {
            return this.price * parseInt(this.qtyInput.value);
        }
    };

    qtyInput.addEventListener("input", function () {
        let qty = parseInt(qtyInput.value);
        if (isNaN(qty) || qty < 1) {
            qty = 1;
            qtyInput.value = "1";
        }
        const total = price * qty;
        totalValue.innerText = `${total.toFixed(0)} บาท`;

        updateSummary();
        speak(`${qty}`);
    });

    cart.push(productItem);
    lastAddedProduct = productItem;

    mainbox.appendChild(itemRow);
    mainbox.appendChild(qtyRow);
    mainbox.appendChild(totalRow);
    addbox.insertBefore(mainbox, addbox.firstChild);

    updateSummary();
    speak(`${price} บาท`);
}

//------------------------คำนวณราคารวม--------------------------------------------------------------------------

function updateSummary() {

    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const qty = parseInt(item.qtyInput.value);
        totalQty += qty;
        totalPrice += item.getTotal();
    });
    unitDisplay.innerText = `${totalQty} รายการ`;
    priceDisplay.innerText = `${totalPrice.toFixed(0)} บาท`;
}
//------------------------คำนวณราคารวม--------------------------------------------------------------------------

//-------------------------ใส่ยอดรับเงิน-----------------------------------------------------------------------

cashInput.addEventListener("input", debounce(function () {
    const cash = parseInt(cashInput.value);

    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.getTotal();
    });

    let change = 0;
    if (!isNaN(cash)) {
        change = cash - totalPrice;
    }

    if (change < 0) {
        change = 0;
    }

    changeValue.innerText = `${change.toFixed(0)} บาท`;
    if (!isNaN(cash) && cash > 0) {
        speak(`รับเงิน ${cash} บาท เงินทอน ${change} บาท`);
    }
}, 1000));

//--------------------paymant-close-----------------------------------------------------------------
const closeBtn = document.querySelector(".paymant-close");
closeBtn.addEventListener("click", function () {
    paymentPopup.style.display = "none";
});


//----------------------ปุ่มกดชำระเงิน----------------------------------------------------------------------

payButton.addEventListener("click", function () {
    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const qty = parseInt(item.qtyInput.value);
        totalQty += qty;
        totalPrice += item.getTotal();
    });

    paymantUnitValue.innerText = `${totalQty} รายการ`;
    paymantPriceValue.innerText = `${totalPrice.toFixed(0)} บาท`;

    paymentPopup.style.display = "block";

    cashInput.focus();
    if (!isNaN(totalPrice) && totalPrice > 0) {
        speak(`รวม${totalPrice} บาท`);
    }
});

//----------------เคลียรหลังจากชำระเงิน--------------------------------------------------------------------------

const clearAllBTN = document.querySelector(".clearAll");
clearAllBTN.addEventListener("click", function () {
    paymentPopup.style.display = "none";

    cashInput.value = "";
    changeValue.innerText = `0 บาท`

    cart = [];
    addbox.innerHTML = "";

    updateSummary();
});

cashInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {

        const cash = parseInt(cashInput.value);
        let change = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.getTotal();
        });

        if (!isNaN(cash)) {
            change = cash - totalPrice;
        }
        if (change < 0) {
            change = 0;
        }

        // ✅ เรียกใหม่ ส่งทีเดียว
        sendSaleToSheet(cash, change);

        // ต่อไป ↓ เป็นใบเสร็จเดิมคุณได้เลย ใช้เหมือนเดิม
        // ------------------ เริ่มสร้างใบเสร็จ ----------------------
        const bill = document.querySelector(".bill");
        const now = new Date();

        const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('th-TH');

        let totalQty = 0;
        totalPrice = 0;
        const items = [];

        cart.forEach(item => {
            const qty = parseInt(item.qtyInput.value);
            const total = item.getTotal();

            totalQty += qty;
            totalPrice += total;

            items.push({
                name: item.name,
                price: item.price,
                qty: qty,
                total: total
            });
        });

        // (ต่อไปใช้ใบเสร็จเดิมคุณได้เลย ↓)
        // ...

        bill.innerHTML = `
    <div class="bill-head">ร้านเจ้พิน ขายของชำ</div>
    
    <div class="bill-detail"><div style="font-weight:bold ;">เวลา:</div><div style="font-weight:bold ;">${timeStr}</div></div>
    <div class="bill-detail"><div style="font-weight:bold ;">วันที่:</div><div style="font-weight:bold ;">${dateStr}</div></div>

    <hr style="border:1px solid #ccc; margin:5px 0;"> <!-- เส้นแบ่ง -->

    <div class="bill-detail"><div style="font-weight:bold ;">สินค้า</div><div style="font-weight:bold ;">จำนวน</div><div style="font-weight:bold ;">ราคารวม</div></div>
`;


        items.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.className = "bill-detail";
            itemRow.innerHTML = `
                <div>${item.name} ${item.price.toFixed(0)} บาท</div>
                <div>x${item.qty}</div>
                <div>${item.total.toFixed(2)}</div>
            `;
            bill.appendChild(itemRow);
        });

        bill.innerHTML += `
            <div class="bill-detail"><div style="font-weight:bold;">รวมทั้งสิ้น</div><div style="font-weight:bold;">${totalPrice.toFixed(2)}</div></div>
            <div class="bill-detail"><div>รับเงิน</div><div>${cash.toFixed(2)}</div></div>
            <div class="bill-detail"><div>เงินทอน</div><div>฿${change.toFixed(2)}</div></div>
            <div style="text-align:center; font-size:1.5vw; padding-top:2vw;">ขอขอบคุณลูกค้าที่มาอุดหนุน</div>
        `;

        // Show .bill
        bill.style.display = "block";

        // เก็บใบเสร็จใน localStorage → ตามที่เคยเขียน
        const receiptData = {
            date: dateStr,
            time: timeStr,
            items: items,
            total: totalPrice.toFixed(2),
            cashReceived: isNaN(cash) ? "0.00" : cash.toFixed(2),
            change: isNaN(change) ? "฿0.00" : `฿${change.toFixed(2)}`
        };


        let receiptHistory = JSON.parse(localStorage.getItem("receiptHistory")) || [];
        receiptHistory.push(receiptData);

        if (receiptHistory.length > 200) {
            receiptHistory = receiptHistory.slice(receiptHistory.length - 200);
        }

        localStorage.setItem("receiptHistory", JSON.stringify(receiptHistory));

        // ตั้งเวลา hide .bill หลัง 10 วินาที
        setTimeout(() => {
            bill.style.display = "none";
        }, 3000);

        // เคลียร์ popup และ cart
        paymentPopup.style.display = "none";
        cashInput.value = "";
        changeValue.innerText = `0 บาท`;

        cart = [];
        addbox.innerHTML = "";

        updateSummary();
        speak(`ขอบคุณค่ะ`);
    }
});

// ใช้ event delegation แทน
document.querySelector(".noncode-product").addEventListener("click", function (e) {
    const productDiv = e.target.closest(".manu-product");
    if (!productDiv) return; // ถ้าไม่ได้คลิกที่ .manu-product → ข้ามไป

    const name = productDiv.getAttribute("data-name");
    const price = parseInt(productDiv.getAttribute("data-price"));

    // เช็คใน cart ว่ามี product นี้อยู่หรือยัง
    const existingProduct = cart.find(item => item.name === name && item.price === price);

    if (existingProduct) {
        let currentQty = parseInt(existingProduct.qtyInput.value);
        currentQty += 1;
        existingProduct.qtyInput.value = currentQty;

        const total = existingProduct.price * currentQty;
        existingProduct.totalValue.innerText = `${total.toFixed(0)} บาท`;

        updateSummary();
        speak(`${currentQty}`);
    } else {
        addProductbox(price, name);
    }
});



// ------------------ โหลด Product List จาก Google Sheet ด้วยวิธีการ-------------------------
//---------ไฟล์ + แชร์ + เผยแพร่ไปยังเว็ป + คัดลองลิงก์ไปใช้งาน ไม่ต้องเขียน app script---------------

let productData = []; // array เก็บ product ทั้งหมด

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRf9pgc47oKg-xrvmmDCwSTD5udMZoZVAXnLdyU47ouysYNO9-pbHzbmYwiVd8bH_rEGIaNUOLJIJ6c/pub?gid=0&output=csv';
                  //pubhtml?gid=0&single=true → ใช้กับ iframe, browser ได้, fetch ไม่ได้
                  //pub?gid=0&output=csv → ใช้กับ fetch() ได้แน่นอน
fetch(sheetURL)
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // ข้าม header
        rows.forEach(row => {
            if (row.trim() === '') return;
            const cols = row.split(',');
            const product = {
                code: cols[0].trim(),
                name: cols[1].trim(),
                price: parseFloat(cols[2])
            };
            productData.push(product);
        });
        console.log("โหลด Product List สำเร็จ:", productData);
    })
    .catch(error => {
        console.error('Error fetching Product List:', error);
    });


//------------------บันทึกยอดขายลง google sheet-----------------------------------------------------------------------------
function sendSaleToSheet(received, change) {
    const items = cart.map(item => {
        const qty = parseInt(item.qtyInput.value);
        const product = productData.find(p => p.name === item.name && p.price === item.price);
        const code = product ? product.code : '';
        return {
            code: code,
            name: item.name,
            qty: qty,
            price: item.price
        };
    });

    const totalQty = cart.reduce((sum, item) => sum + parseInt(item.qtyInput.value), 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.getTotal(), 0);

    const payload = {
        sheet: "รายการขาย",
        datetime: new Date().toISOString(), // ใช้แบบ script_old
        items: JSON.stringify(items),    // ใช้แบบ script_old
        totalQty: totalQty,
        totalPrice: totalPrice,
        received: received,
        change: change
    };

    const simpleBody = 'data=' + encodeURIComponent(JSON.stringify(payload));

    fetch('https://script.google.com/macros/s/AKfycbxfRYYdCDbVsuwsi-J3k8i6NiG9CJjE03XIf4HwYAV9QoY5MGrrBGA8V0LwGXCSaBcYjw/exec', {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: simpleBody,
        mode: 'no-cors'
    })
        .catch(err => console.error('❌ ส่งข้อมูลไม่สำเร็จ:', err));
}




//--------------------แปลงเวลาเพื่อแสดงยอดขายให้ถูกต้อง----------------------------------------------------------------------------

function parseDate(dateStr) {
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    if (dateStr.includes('-') && dateStr.length === 10) {
        return dateStr;
    }
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return '';
}

//--------------------แปลงเวลาเพื่อแสดงยอดขายให้ถูกต้อง----------------------------------------------------------------------------
function getLocalTodayStr() {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // เซ็ตเวลาเป็น 00:00 → ให้ match กับ timestamp ของ Google Sheet
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getLocalYesterdayStr() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // เซ็ตเวลาเป็น 00:00 → ให้ match กับ timestamp ของ Google Sheet
    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const day = yesterday.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


//----------------------------อัพเดทเพื่อแสดงยอมขายรวมรายวัน---------------------------------------------------------
function updateSalesSummary() {
    const saleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRf9pgc47oKg-xrvmmDCwSTD5udMZoZVAXnLdyU47ouysYNO9-pbHzbmYwiVd8bH_rEGIaNUOLJIJ6c/pub?gid=1579978897&output=csv';

    fetch(saleSheetURL)
        .then(response => response.text())
        .then(data => {
            console.log('CSV Data:', data);

            const rows = data.split('\n').slice(1);
            console.log('Parsed Rows:', rows);

            const todayStr = getLocalTodayStr();
            const yesterdayStr = getLocalYesterdayStr();

            console.log(`todayStr: ${todayStr} → yesterdayStr: ${yesterdayStr}`);

            let totalToday = 0;
            let totalYesterday = 0;
            let total30Days = 0;

            rows.forEach(row => {
                console.log('Processing row:', row);

                const cols = row.split(',');
                const timestamp = cols[0]?.trim();
                const total = parseFloat(cols[1]?.replace(/[^\d.-]+/g, '') || '0');

                if (!timestamp) return;

                const parsedDateStr = parseDate(timestamp);
                console.log(`parsedDateStr: ${parsedDateStr} → todayStr: ${todayStr} → yesterdayStr: ${yesterdayStr}`);

                if (parsedDateStr === todayStr) {
                    totalToday += total;
                }

                if (parsedDateStr === yesterdayStr) {
                    totalYesterday += total;
                }

                const rowDate = new Date(parsedDateStr);
                const daysDiff = (new Date() - rowDate) / (1000 * 60 * 60 * 24);

                if (daysDiff <= 30 && daysDiff >= 0) {
                    total30Days += total;
                }
            });


            const summaryBoxes = document.querySelectorAll('.monitorTotalPrice-day > div > div:nth-child(2)');
            summaryBoxes[0].innerText = `${totalToday.toFixed(0)} บาท`;
            summaryBoxes[1].innerText = `${totalYesterday.toFixed(0)} บาท`;
            // summaryBoxes[2].innerText = `${total30Days.toFixed(0)} บาท`;
        })
        .catch(error => {
            console.error('Error fetching sales summary:', error);
        });

    // เพิ่ม URL ของบันทึกยอดขายรายเดือน
    const monthlySheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRf9pgc47oKg-xrvmmDCwSTD5udMZoZVAXnLdyU47ouysYNO9-pbHzbmYwiVd8bH_rEGIaNUOLJIJ6c/pub?gid=1715714591&output=csv';


    fetch(monthlySheetURL)
        .then(response => response.text())
        .then(data => {
            console.log('Monthly CSV:', data);

            const rows = data.split('\n').slice(1);
            const currentMonth = new Date().getMonth() + 1; // JS เดือน 0-11 → +1
            const currentYear = new Date().getFullYear();
            const currentMonthStr = `${currentMonth.toString().padStart(2, '0')}/${currentYear}`;

            let totalMonth = 0;

            rows.forEach(row => {
                const cols = row.split(',');
                const timestamp = cols[0]?.trim();
                const total = parseFloat(cols[1]?.trim() || '0');

                if (timestamp === currentMonthStr) {
                    totalMonth += total;
                }
            });

            console.log(`ยอดเดือนนี้ (${currentMonthStr}): ${totalMonth} บาท`);

            // เอายอดเดือนนี้มาแสดงแทนช่อง 30 วัน
            const summaryBoxes = document.querySelectorAll('.monitorTotalPrice-day > div > div:nth-child(2)');
            summaryBoxes[2].innerText = `${totalMonth.toFixed(0)} บาท`;
        })
        .catch(error => {
            console.error('Error fetching monthly sales:', error);
        });

}

const Btnreceipt = document.getElementById("receipt");
const receiptPopup = document.getElementById("receiptPopup");
const closeReceiptPopup = document.getElementById("closeReceiptPopup");
const receiptHistoryContent = document.getElementById("receiptHistoryContent");

Btnreceipt.addEventListener("click", function () {
    if (receiptPopup.style.display === "none") {
        // Show popup
        receiptPopup.style.display = "block";

        // Load receipt history
        let receiptHistory = JSON.parse(localStorage.getItem("receiptHistory")) || [];

        if (receiptHistory.length === 0) {
            receiptHistoryContent.innerHTML = "<p style='text-align:center;'>ยังไม่มีใบเสร็จย้อนหลัง</p>";
            return;
        }

        // Clear content
        receiptHistoryContent.innerHTML = "";

        // Show last 100 receipts → slice().reverse()
        receiptHistory.slice(-100).reverse().forEach((receipt, index) => {
            const receiptDiv = document.createElement("div");
            receiptDiv.style.border = "1px solid #ccc";
            receiptDiv.style.margin = "10px 0";
            receiptDiv.style.padding = "10px";
            receiptDiv.style.borderRadius = "10px";
            receiptDiv.style.background = "#f9f9f9";

            let itemHTML = `
                <div style="font-weight:bold; color:green;">🧾 ใบที่ ${index + 1}</div>
                <div><b>เวลา:</b> ${receipt.time}</div>
                <div><b>วันที่:</b> ${receipt.date}</div>
                <div><b>สินค้า:</b></div>
            `;

            if (Array.isArray(receipt.items)) {
                receipt.items.forEach(item => {
                    itemHTML += `
                        <div style="margin-left:20px;">
                            - ${item.name} (${item.price.toFixed(0)} บาท) x${item.qty} → ${item.total.toFixed(2)} บาท
                        </div>
                    `;
                });
            }

            itemHTML += `
                <div><b>รวมทั้งสิ้น:</b> ${receipt.total} บาท</div>
                <div><b>รับเงิน:</b> ${receipt.cashReceived} บาท</div>
                <div><b>เงินทอน:</b> ${receipt.change}</div>
            `;

            receiptDiv.innerHTML = itemHTML;
            receiptHistoryContent.appendChild(receiptDiv);
        });
    } else {
        // Hide popup
        receiptPopup.style.display = "none";
    }
});

// ปุ่มปิด popup
closeReceiptPopup.addEventListener("click", function () {
    receiptPopup.style.display = "none";
});
