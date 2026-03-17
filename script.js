let cart = [];
let lastAddedProduct = null;

const payButton = document.querySelector(".pay");
const paymentPopup = document.getElementById("paymant");

const paymantUnitValue = document.getElementById("paymant-unit-value");
const paymantPriceValue = document.getElementById("paymant-price-value");

const cashInput = document.getElementById("cashInput");
const changeValue = document.getElementById("change-value");

const changeunit = document.getElementById("change-unit-value");

const input = document.getElementById("productInput");
const addbox = document.getElementById("addProduct_box");

const unitDisplay = document.querySelector(".unit div:nth-child(2)");
const priceDisplay = document.querySelector(".price div:nth-child(2)");

//-------สร้างรายการสินค้าแบบ icon -----------------------
const products = [
    { name: "น้ำดื่มสิงห์", price: 50, img: "น้ำดื่มสิงห์.png" },
    { name: "น้ำดื่มทิพย์", price: 50, img: "น้ำทิพย์.png" },
    { name: "น้ำดื่มเลิฟ", price: 29, img: "น้ำเลิฟ.png" },
    { name: "น้ำแข็ง", price: 10, img: "น้ำเเข็ง.png" },
    { name: "น้ำถังฟ้า", price: 25, img: "น้ำดื่มถังฟ้า.png" },
    { name: "ถ่านถังขาว", price: 15, img: "น้ำดื่มถังขาว.png" },
    { name: "ไข่เยี่ยวม้า", price: 8, img: "ไข่เยี่ยวม้า.png" },
    { name: "ไข่เค็ม", price: 8, img: "ไข่เค็ม.png" },
    { name: "ไข่ไก่", price: 5, img: "ไข่ไก่.png" },
    { name: "แก๊สถังใหญ่ 15 โล", price: 460, img: "แก๊ส 15 โล.png" },
    { name: "แก๊สถัง 9.5 โล", price: 310, img: "แก๊ส 10 โล.png" },
    { name: "แก๊สปิ๊กนิค", price: 180, img: "แก๊สปิ๊กนิค.png" },
    { name: "ไม้กวาด", price: 50, img: "ไม้กวาด.png" },
    { name: "ไม้กวาดทางมะพร้าว", price: 40, img: "ไม้กวาดทางมะพร้าว.png" },
    { name: "น้ำมัน 91,95", price: 40, img: "น้ำมัน 91,95.png" },
    { name: "เตาถ่าน", price: 130, img: "เตาถ่าน.png" },
    { name: "ถ่านหุงต้ม", price: 20, img: "ถ่านหุงต้ม.png" },
    { name: "หอม กระเทียม", price: 20, img: "หอมกระเทียม.png" }
];

function renderProducts() {
    const container = document.querySelector(".noncode-product");
    // container.innerHTML = ''; // ล้างของเก่าทิ้งก่อน

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

// ✅ Focus ตามเงื่อนไขที่กำหนด
function checkAndFocusInput() {
  const isPayPopupOpen = window.getComputedStyle(paymentPopup).display !== "none";
  const isNewProdPopupOpen = window.getComputedStyle(newProductPopup).display !== "none";
  const ae = document.activeElement;

  if (isPayPopupOpen) {
    // โหมดชำระเงิน → ปล่อยให้ช่องรับเงินคุมโฟกัส
    if (ae !== cashInput) cashInput.focus();
    return;
  }

  if (isNewProdPopupOpen) {
    // ถ้าโฟกัสอยู่ "ภายใน" popup อยู่แล้ว (ราคา/ชื่อ/รหัส/ปุ่ม) → อย่าแย่งโฟกัส
    if (newProductPopup.contains(ae)) return;

    // ถ้าโฟกัสอยู่นอก popup (เช่น body) → โยนเข้าช่องราคา (ครั้งเดียว)
    npPrice.focus();
    return;
  }

  // ไม่มี popup → คุมโฟกัสตามเงื่อนไขปกติ
  if (cart.length === 0 && ae !== input) input.focus();
}


// ตรวจสอบทุก 500ms
setInterval(checkAndFocusInput, 500);

// ✅ หากกดตัวเลขโดยที่ popup ยังไม่เปิด → focus ที่ช่อง productInput
document.addEventListener("keydown", function (event) {
  const isNumberKey = event.key >= '0' && event.key <= '9';
  const isPayPopupOpen = window.getComputedStyle(paymentPopup).display !== "none";
  const isNewProdPopupOpen = window.getComputedStyle(newProductPopup).display !== "none";

  if (isNumberKey && !isPayPopupOpen && !isNewProdPopupOpen) {
    input.focus();
  }
});


document.addEventListener("keydown", function (event) {
  const isPayPopupOpen = window.getComputedStyle(paymentPopup).display !== "none";
  const isNewProdPopupOpen = window.getComputedStyle(newProductPopup).display !== "none";

  if (event.key === "Enter" && !isPayPopupOpen && !isNewProdPopupOpen) {
    input.focus();
  }
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

    const opening = window.getComputedStyle(paymentPopup).display === "none";
    paymentPopup.style.display = opening ? "block" : "none";

    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach(item => {
      const qty = parseInt(item.qtyInput.value) || 0;
      totalQty += qty;
      totalPrice += item.getTotal();
    });

    // ✅ แสดงว่างเมื่อค่าเป็น 0
    paymantUnitValue.innerText  = totalQty  > 0 ? `${totalQty} รายการ`        : "";
    paymantPriceValue.innerText = totalPrice > 0 ? `${totalPrice.toFixed(0)} บาท` : "";

    // เคลียร์รับเงิน/เงินทอนทุกครั้งที่เปิด
    cashInput.value = "";
    changeValue.innerText = "";

    if (opening) cashInput.focus();

    if (totalPrice > 0) {
      speak(`รวม ${totalPrice} บาท`);
    }
  }
});

//------------------กดปุ่ม+เพื่อเรียก pop up ชำระสินค้าขึ้นมา---------------------------------


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
let enterPressed = false; // 🔒 ตัวแปรล็อก

// 👉 ส่วนกด Enter (keydown)
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !enterPressed) {
    enterPressed = true;

    const code = input.value.trim();

    if (code === "") {
  // กด Enter ตอนช่องรหัสว่าง -> เพิ่มจำนวนสินค้าของรายการล่าสุด
  event.preventDefault(); // กันการส่งฟอร์มหรือผลข้างเคียง
  if (lastAddedProduct) {
    let currentQty = parseInt(lastAddedProduct.qtyInput.value, 10) || 1;
    currentQty += 1;
    lastAddedProduct.qtyInput.value = String(currentQty);

    const total = lastAddedProduct.price * currentQty;
    lastAddedProduct.totalValue.innerText = `${total.toFixed(0)} บาท`;

    updateSummary();
    speak(`${currentQty}`);  // พูดจำนวนล่าสุด (เช่น "2", "3", ...)
  } else {
    // ยังไม่มีสินค้าในตะกร้า กด Enter ว่างๆ ก็ไม่ต้องทำอะไร (หรือจะ speak("ไม่มี") ก็ได้)
    // speak("ไม่มี");
  }

  // เคลียร์อินพุตและคงโฟกัสไว้ที่ช่องสแกน
  input.value = "";
  input.focus();
  return;
}

    // ⛔ กัน “0”, “00”, “000” ฯลฯ
    if (/^0+$/.test(code)) {
      input.value = "";
      return;
    }

    const value = Number(code);
    const foundProduct = productData.find(p => p.code === code);

    if (!Number.isNaN(value) && value >= 1 && value <= 9999) {
      addProductbox(value);
    } else if (foundProduct) {
      addProductbox(foundProduct.price, foundProduct.name, foundProduct.code);
    } else {
      speak("ไม่มี");
      openNewProductPopup(code);
    }

    input.value = "";
  }
});


// 👉 ส่วนปล่อยปุ่ม Enter (keyup) → รีเซ็ตให้กดได้ใหม่
input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        enterPressed = false;
    }
});



//-------------------ช่องใส่รหัสสินค้า--------------------------------------------

//---------------กด + เพื่อเพิ่มจำนวนสินค้า----------------------------------
//--------------- ลดจำนวนด้วย Backspace (เวอร์ชันแก้บั๊ก) ------------------
let backspacePressed = false;

function isTypingContext(el) {
  if (!el) return false;
  const tag = el.tagName;
  const type = (el.type || '').toLowerCase();
  const isInput = tag === 'INPUT' && !['button','submit','checkbox','radio','range','file','color','date','time','month','week'].includes(type);
  return isInput || tag === 'TEXTAREA' || el.isContentEditable === true;
}

document.addEventListener("keydown", function (event) {
  if (event.key !== "Backspace" || backspacePressed) return;

  // ไม่รบกวนตอน popup ใด ๆ เปิดอยู่
  const payOpen = window.getComputedStyle(paymentPopup).display !== "none";
  const newProdOpen = window.getComputedStyle(newProductPopup).display !== "none";
  if (payOpen || newProdOpen) return;

  const ae = document.activeElement;
  const typing = isTypingContext(ae);
  const isScanInput = ae === input;

  // ถ้ากำลังพิมพ์อยู่:
  // - ถ้าเป็นช่องสแกนและ "มีตัวอักษรอยู่" ให้ Backspace ทำงานลบตามปกติ (return)
  // - ถ้าเป็น input อื่น ๆ (เช่น cashInput, ช่องแก้ไขราคา/ชื่อ) ก็ให้ลบตามปกติ (return)
  if (typing) {
    if (!isScanInput || (isScanInput && input.value.length > 0)) {
      return; // ปล่อยผ่าน ไม่ลดจำนวน
    }
    // ถ้าเป็นช่องสแกนแต่ "ว่าง" → ถือว่าเป็นคีย์ลัด ลดจำนวนสินค้าได้
  }

  // ถึงตรงนี้แปลว่าเราจะใช้ Backspace เป็นคีย์ลัดลดจำนวน
  backspacePressed = true;

  if (lastAddedProduct) {
    let currentQty = parseInt(lastAddedProduct.qtyInput.value, 10) || 1;

    if (currentQty > 1) {
      event.preventDefault();      // กันไม่ให้ไปลบในช่องอินพุต
      document.activeElement.blur(); // กันคีย์ repeat ในบางบราวเซอร์

      currentQty -= 1;
      lastAddedProduct.qtyInput.value = String(currentQty);
      const total = lastAddedProduct.price * currentQty;
      lastAddedProduct.totalValue.innerText = `${total.toFixed(0)} บาท`;

      updateSummary();
      speak(`${currentQty}`);
    }
    // ถ้า currentQty === 1 → ไม่ preventDefault เพื่อให้ Backspace (ที่ช่องสแกนว่าง) ไม่มีผลอะไร
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Backspace") {
    backspacePressed = false;
  }
});
//---------------------------------------------------------------------------


//---------------กด + เพื่อเพิ่มจำนวนสินค้า----------------------------------

//--------------------เพิ่มสินค้าลงในตะกร้า-----------------------------------------------------------------------------

function addProductbox(price, name = "สินค้าอื่นๆ", code = "") {
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
  totalValue.innerText = `${price.toFixed(0)} บาท`;
  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalValue);

  // ❌ เอา click ลบออก ไม่ใส่ handler ลบที่นี่แล้ว

  const productItem = {
    name: name,
    price: price,
    code: code,            // เก็บรหัสไว้เพื่ออัปเดตชีต
    qtyInput: qtyInput,
    totalValue: totalValue,
    getTotal: function () {
      return this.price * parseInt(this.qtyInput.value);
    }
  };

  // ผูกอ้างอิงกลับไปที่ DOM กล่อง
  mainbox._productItem = productItem;

  qtyInput.addEventListener("input", function () {
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
      qtyInput.value = "1";
    }
    const total = productItem.price * qty;
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


// ====== แตะค้าง 2 วิ เพื่อแก้ไขสินค้า ======
// ====== แตะ 1 ครั้ง = ลบ, แตะค้าง 2 วิ = แก้ไข ======
let holdTimer = null;
let holdTarget = null;
let holdTriggered = false;  // true เมื่อครบ 2 วิแล้วเรียกแก้ไข เพื่อกันคลิกตามหลัง

function startHold(target) {
  clearTimeout(holdTimer);
  holdTriggered = false;     // เริ่มรอบใหม่ถือว่ายังไม่ trigger
  holdTarget = target;
  holdTimer = setTimeout(() => {
    if (!holdTarget) return;
    holdTriggered = true;    // บอกว่ามาจาก hold
    editItem(holdTarget);    // เรียกแก้ไข
    holdTarget = null;
  }, 2000); // 2 วิ
}
function cancelHold() {
  clearTimeout(holdTimer);
  holdTimer = null;
  holdTarget = null;
}

addbox.addEventListener('pointerdown', (e) => {
  const box = e.target.closest('.addProduct');
  if (!box) return;
  startHold(box);
});
['pointerup','pointerleave','pointercancel'].forEach(ev => {
  addbox.addEventListener(ev, cancelHold);
});

// คลิกสั้น = ลบ (ถ้ามี holdTriggered แปลว่าเพิ่งแตะค้าง → ไม่ลบ)
addbox.addEventListener('click', (e) => {
  const box = e.target.closest('.addProduct');
  if (!box) return;

  // ถ้าเพิ่งแตะค้างจนเข้าโหมดแก้ไข ให้ข้ามคลิกนี้ไป
  if (holdTriggered) {
    holdTriggered = false;   // รีเซ็ตไว้สำหรับครั้งถัดไป
    return;
  }

  const item = box._productItem;
  if (!item) return;

  const index = cart.indexOf(item);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  box.remove();
  updateSummary();
  if (lastAddedProduct === item) lastAddedProduct = null;
});





// เปิดหน้าต่างแก้ไข (prompt สั้นๆ)
function editItem(box){
  const item = box._productItem;
  if (!item) return;

  let newName = prompt('แก้ไขชื่อสินค้า', item.name);
  if (newName === null) return;             // กดยกเลิก
  newName = newName.trim() || 'สินค้าอื่นๆ';

  let newPriceStr = prompt('แก้ไขราคา', item.price);
  if (newPriceStr === null) return;         // กดยกเลิก
  const newPrice = Number(newPriceStr);
  if (!newPrice || newPrice <= 0) {
    alert('ราคาไม่ถูกต้อง');
    return;
  }

  // อัปเดตข้อมูลในอ็อบเจ็กต์
  item.name  = newName;
  item.price = newPrice;

  // อัปเดตหัวแถวชื่อ/ราคา
  const headerRow = box.querySelector(':scope > div:nth-child(1)');
  if (headerRow) {
    headerRow.innerHTML = `<div>${newName}</div><div>${newPrice.toFixed(0)} บาท</div>`;
  }

  // อัปเดตราคารวม
  const qty = parseInt(item.qtyInput.value) || 1;
  item.totalValue.innerText = `${(newPrice * qty).toFixed(0)} บาท`;

  updateSummary();

  // อัปเดตฐานข้อมูลในหน้า (ถ้ามี code)
  if (item.code) {
    const p = productData.find(pp => pp.code === item.code);
    if (p) { p.name = newName; p.price = newPrice; }
    updateProductInSheet(item.code, newName, newPrice);   // บันทึกทับ
  } else {
    // ถ้าไม่มี code → เพิ่มใหม่เข้า "รายการสินค้า"
    sendNewProductToSheet('', newName, newPrice);
  }
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

    // จำนวนสินค้า
    if (totalQty > 0) {
        unitDisplay.innerText = `${totalQty} รายการ`;
    } else {
        unitDisplay.innerText = ""; // ❌ ไม่โชว์ถ้าเป็น 0
    }

    // ราคารวม
    if (totalPrice > 0) {
        priceDisplay.innerText = `${totalPrice.toFixed(0)} บาท`;
    } else {
        priceDisplay.innerText = ""; // ❌ ไม่โชว์ถ้าเป็น 0
    }
}

//------------------------คำนวณราคารวม--------------------------------------------------------------------------

//-------------------------ใส่ยอดรับเงิน-----------------------------------------------------------------------

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

  // ไม่ให้ติดลบ
  if (change < 0) change = 0;

  // ✅ แสดงค่าว่างถ้าเงินทอนเป็น 0 หรือใส่เงินไม่ถูกต้อง
  if (!isNaN(cash) && change > 0) {
    changeunit.innerText = "เงินทอน";
    changeValue.innerText = `${change.toFixed(0)} บาท`;
  } else {
    changeValue.innerText = "";
    changeunit.innerText = "";
  }

  // ✅ แก้ไขเงื่อนไขการพูด: จะพูดก็ต่อเมื่อยอดรับเงิน "มากกว่า" ยอดรวม (มียอดเงินทอน) เท่านั้น
  if (!isNaN(cash) && cash > totalPrice) {
    speak(`รับเงิน ${cash} บาท เงินทอน ${change} บาท`);
  } 
  // หากอยากให้พูดกรณีลูกค้าให้เงินมาพอดีเป๊ะ (ไม่บังคับ) สามารถลบคอมเมนต์ด้านล่างออกได้ครับ
  /* else if (!isNaN(cash) && cash === totalPrice && totalPrice > 0) {
    speak(`รับเงินพอดีค่ะ`);
  }
  */

}, 500));


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
    const qty = parseInt(item.qtyInput.value) || 0;
    totalQty += qty;
    totalPrice += item.getTotal();
  });

  // ✅ ไม่แสดงถ้าเป็น 0
  paymantUnitValue.innerText  = totalQty  > 0 ? `${totalQty} รายการ`         : "";
  paymantPriceValue.innerText = totalPrice > 0 ? `${totalPrice.toFixed(0)} บาท` : "";

  paymentPopup.style.display = "block";

  cashInput.focus();
  cashInput.value = "";
  changeValue.innerText = "";
  changeunit.innerText = "";

  if (totalPrice > 0) {
    speak(`รวม ${totalPrice} บาท`);
  }
});


//----------------เคลียรหลังจากชำระเงิน--------------------------------------------------------------------------

const clearAllBTN = document.querySelector(".clearAll");
clearAllBTN.addEventListener("click", function () {
    paymentPopup.style.display = "none";

    cashInput.value = "";
    changeValue.innerText = "";
    changeunit.innerText = "";

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

        if (receiptHistory.length > 2000) {
            receiptHistory = receiptHistory.slice(receiptHistory.length - 2000);
        }

        localStorage.setItem("receiptHistory", JSON.stringify(receiptHistory));

        // ตั้งเวลา hide .bill หลัง 10 วินาที
        setTimeout(() => {
            bill.style.display = "none";
        }, 3000);

        // เคลียร์ popup และ cart
        paymentPopup.style.display = "none";
        cashInput.value = "";
        changeValue.innerText = "";
        changeunit.innerText = "";

        cart = [];
        addbox.innerHTML = "";
        lastAddedProduct = null;

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













/* ===================== พักบิลหลายบิล ===================== */
// เก็บบิลชั่วคราวไว้ใน localStorage
let heldBills = [];
try {
  heldBills = JSON.parse(localStorage.getItem("heldBills") || "[]");
} catch { heldBills = []; }

function saveHeldBills() {
  localStorage.setItem("heldBills", JSON.stringify(heldBills));
}

// สร้าง/คืนค่า panel รายการบิลพัก (ถ้ายังไม่มีจะสร้าง)
function ensureHeldPanel() {
  let panel = document.getElementById("heldPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "heldPanel";
    panel.innerHTML = `
      <div class="heldPanel-header">
        <span>บิลที่พักไว้</span>
        <button id="heldPanelClose" title="ปิด">×</button>
      </div>
      <div id="heldList" class="heldPanel-list"></div>
    `;
    document.body.appendChild(panel);

    document.getElementById("heldPanelClose").addEventListener("click", () => {
      panel.style.display = "none";
    });

    // เดเลเกตปุ่มในลิสต์
    panel.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === "resume") resumeHeldBill(id);
      if (action === "delete") deleteHeldBill(id);
    });
  }
  return panel;
}

function renderHeldList() {
  const panel = ensureHeldPanel();
  const list = panel.querySelector("#heldList");
  if (!heldBills.length) {
    list.innerHTML = `<div class="heldPanel-empty">ไม่มีบิลที่พักไว้</div>`;
  } else {
    list.innerHTML = heldBills.map((b, idx) => {
      const created = new Date(b.createdAt);
      const when = created.toLocaleString(); // เวลา/วันที่สร้างบิล
      return `
        <div class="heldItem">
          <div class="heldItem-main">
            <div class="heldItem-title">บิล #${idx + 1}</div>
            <div class="heldItem-sub">จำนวน ${b.items.length} รายการ • รวม ${b.subtotal.toFixed(0)} บาท</div>
            <div class="heldItem-time">${when}</div>
          </div>
          <div class="heldItem-actions">
            <button data-action="resume" data-id="${b.id}">ดึงกลับ</button>
            <button data-action="delete" data-id="${b.id}" class="danger">ลบ</button>
          </div>
        </div>
      `;
    }).join("");
  }
}

// เคลียร์ตะกร้าปัจจุบัน (ไม่กระทบฟังก์ชันเดิมคุณ)
function clearCartUI() {
  try {
    // ลบ DOM กล่องใน #addProduct_box
    const addboxEl = typeof addbox !== "undefined" ? addbox : document.getElementById("addProduct_box");
    if (addboxEl) addboxEl.innerHTML = "";
    // เคลียร์ข้อมูลในหน่วยความจำ
    cart.length = 0;
    if (typeof lastAddedProduct !== "undefined") lastAddedProduct = null;
    if (typeof updateSummary === "function") updateSummary();
  } catch (e) {
    console.warn("clearCartUI warn:", e);
  }
}

// จับข้อมูลตะกร้า ณ ปัจจุบัน
function snapshotCurrentCart() {
  const items = cart.map(it => ({
    name: it.name,
    price: Number(it.price),
    qty: parseInt(it.qtyInput?.value || 1),
    code: it.code || ""
  }));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return { items, subtotal };
}

// พักบิล: กดปุ่ม id="billhold"
function holdCurrentBill() {
  if (!cart.length) {
    return;
  }
  const snap = snapshotCurrentCart();
  const id = String(Date.now());
  heldBills.unshift({
    id,
    createdAt: new Date().toISOString(),
    ...snap
  });
  saveHeldBills();
  renderHeldList();

  // เคลียร์ตะกร้าหลังพักสำเร็จ
  clearCartUI();
  // โชว์ panel ให้เห็นว่าพักสำเร็จ
  const panel = ensureHeldPanel();
  panel.style.display = "block";
}

// ดึงบิลกลับตาม id
function resumeHeldBill(id) {
  const idx = heldBills.findIndex(b => b.id === id);
  if (idx === -1) return;

  // ถ้ายังมีของในตะกร้า ให้ถามผู้ใช้ (กันเผลอทับ)
  if (cart.length) {
    const ok = confirm("มีรายการอยู่ในตะกร้า ต้องการเคลียร์แล้วดึงบิลพักกลับมาหรือไม่?");
    if (!ok) return;
    clearCartUI();
  }

  const bill = heldBills[idx];

  // 🔇 ปิดเสียงชั่วคราว ระหว่างดึงบิลกลับ (ทั้งราคาตอน addProductbox และเสียง qty)
  const prevSpeak = window.speak;
  window.speak = function () { /* muted while resuming bill */ };

  try {
    // สร้างกล่องสินค้ากลับเข้าไปทีละตัว
    bill.items.forEach(it => {
      addProductbox(it.price, it.name, it.code || "");
      // ตั้งจำนวนตามที่พักไว้
      const addboxEl = typeof addbox !== "undefined" ? addbox : document.getElementById("addProduct_box");
      const box = addboxEl.querySelector(".addProduct"); // ใบล่าสุดอยู่บนสุด
      if (box && box._productItem && box._productItem.qtyInput) {
        box._productItem.qtyInput.value = String(it.qty || 1);
        // trigger คำนวณใหม่ (ระหว่างนี้ก็เงียบ)
        box._productItem.qtyInput.dispatchEvent(new Event("input"));
      }
    });
  } finally {
    // 🔊 เปิดเสียงกลับคืน
    window.speak = prevSpeak;
  }

  // เอาบิลออกจากรายการพัก
  heldBills.splice(idx, 1);
  saveHeldBills();
  renderHeldList();

  // ❌ ไม่ต้องพูดทวนราคา/ข้อความใด ๆ ตอนดึงบิลกลับ
  // speak?.("ดึงบิลกลับ");  // <- เอาออก

  // ซ่อน panel เพื่อไปคิดเงินต่อ
  const panel = ensureHeldPanel();
  panel.style.display = "none";
}


// ลบบิลพัก
function deleteHeldBill(id) {
  const idx = heldBills.findIndex(b => b.id === id);
  if (idx === -1) return;
  const ok = confirm("ลบบิลพักนี้?");
  if (!ok) return;
  heldBills.splice(idx, 1);
  saveHeldBills();
  renderHeldList();
}

/* === hook ปุ่ม "พักบิล" id="billhold" === */
(() => {
  const btn = document.getElementById("billhold");
  if (btn) btn.addEventListener("click", () => {
    // มีสินค้าในตะกร้า → พักบิล
    if (cart.length > 0) {
      holdCurrentBill();
      return;
    }

    // ไม่มีสินค้าในตะกร้า → เรียกบิล
    if (!heldBills.length) {
      // ไม่มีบิลพักเลย
      speak?.("ไม่มีบิลพัก");
      const panel = ensureHeldPanel();
      renderHeldList();
      panel.style.display = "block"; // โชว์แผงว่างๆให้เห็นด้วย
      return;
    }

    if (heldBills.length === 1) {
      // มีบิลเดียว → ดึงกลับทันที
      resumeHeldBill(heldBills[0].id);
      return;
    }

    // มีหลายบิล → เปิดแผงให้เลือก
    const panel = ensureHeldPanel();
    renderHeldList();
    panel.style.display = "block";
  });

  // ให้กด F9 เปิด/ปิด panel รายการบิลพักได้สะดวก (คงไว้เหมือนเดิม)
  document.addEventListener("keydown", (e) => {
    if (e.key === "F9") {
      const panel = ensureHeldPanel();
      panel.style.display = (panel.style.display === "block") ? "none" : "block";
      if (panel.style.display === "block") renderHeldList();
    }
  });

  // render ครั้งแรก (ถ้ามีบิลพักอยู่แล้ว)
  if (heldBills.length) {
    const panel = ensureHeldPanel();
    renderHeldList();
    panel.style.display = "none";
  }
})();





document.addEventListener('keydown', (e) => {
  // ให้ทำงานเมื่อกด "/" หรือ NumpadDivide
  if (e.code === 'NumpadDivide' || e.key === '/') {
    // ถ้า popup ชำระเงินหรือ popup เพิ่มสินค้าเปิดอยู่ → ไม่รบกวน
    const payOpen = window.getComputedStyle(paymentPopup).display !== 'none';
    const newProdOpen = window.getComputedStyle(newProductPopup).display !== 'none';
    if (payOpen || newProdOpen) return;

    e.preventDefault();

    // ใช้รายการล่าสุด (lastAddedProduct) เป็นเป้าหมายแก้ไข
    const box = getBoxForItem(lastAddedProduct);
    if (box) {
      editItem(box);            // ← ใช้ฟังก์ชันเดิมของคุณ
    } else {
      speak?.('ไม่มีสินค้าให้แก้ไข');
    }
  }
});
















// ------------------ โหลด Product List จาก Google Sheet ด้วยวิธีการ-------------------------
//---------ไฟล์ + แชร์ + เผยแพร่ไปยังเว็ป + คัดลองลิงก์ไปใช้งาน ไม่ต้องเขียน app script---------------

let productData = []; // array เก็บ product ทั้งหมด

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReyUk4ahfjc5-kkIaRZloMwz3LwWc3LnYa2DYF40XQjv0yavN98SlzRsJbo5ilWYNsLtYcAfRh4hjL/pub?output=csv';
                  
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

    fetch('https://script.google.com/macros/s/AKfycbyQ2Q56PQolTPyvtBG26XGPqj6KvrmNxmePuDkOS2FxMA_flWXoYH9gLYQvAQmr2qbD6w/exec', {
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


//----------------------------อัพเดทเพื่อแสดงยอมขายรวม---------------------------------------------------------
function updateSalesSummary() {
    const saleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJSMGhRf-b5wh1PTsfV0gRbO-n5qXkohpwOIJ_EemIxfbG-1fCwdxAPyRbbM6XuNHWIYVozEFba_pT/pub?gid=983528119&single=true&output=csv';
                          
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
    const monthlySheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQJSMGhRf-b5wh1PTsfV0gRbO-n5qXkohpwOIJ_EemIxfbG-1fCwdxAPyRbbM6XuNHWIYVozEFba_pT/pub?gid=762124129&single=true&output=csv';
                             

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
//----------------------------อัพเดทเพื่อแสดงยอมขายรวม---------------------------------------------------------
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




// ===================== Popup: เพิ่มสินค้าที่ไม่มีในระบบ =====================
const newProductPopup = document.getElementById("newProductPopup");
const modalBackdrop = document.getElementById("modalBackdrop");
const npCode = document.getElementById("np-code");
const npName = document.getElementById("np-name");
const npPrice = document.getElementById("np-price");
const npSave = document.getElementById("np-save");
const npError = document.getElementById("np-error");
const closeNewProductPopup = document.getElementById("closeNewProductPopup");

// หมายเหตุ: ปรับให้ตรงกับตัวแปร input ช่องสแกนรหัสในโปรเจกต์คุณ
// ถ้าในไฟล์ของคุณชื่อ scanInput ให้แทน input ด้วย scanInput
// const input = typeof scanInput !== "undefined" ? scanInput : document.getElementById("scan-input");

// productData: อาร์เรย์รายการสินค้าที่โหลดไว้ในหน้านี้ (ให้มีอยู่แล้ว)
// เช่น [{ code: "1001", name: "โค้ก", price: 15 }, ...]
window.productData = window.productData || [];

function openNewProductPopup(codeStr) {
  npError.style.display = "none";
  npError.textContent = "";

  npCode.value = (codeStr || "").trim();
  npName.value = "";
  npPrice.value = "";

  newProductPopup.style.display = "block";
  modalBackdrop.style.display = "block";

  // อนุญาตให้โฟกัสช่องชื่อได้ปกติ, ห้ามเฉพาะช่องรหัส
  newProductPopup.onfocusin = (e) => {
    if (e.target === npCode) {
      e.preventDefault();
    }
  };

  // โฟกัสช่องราคา หนึ่งครั้งตอนเปิด
  setTimeout(() => { npPrice.focus({ preventScroll: true }); npPrice.select(); }, 0);
}


function closeNewProduct() {
  newProductPopup.style.display = "none";
  modalBackdrop.style.display = "none";
  input?.focus();
}



if (closeNewProductPopup) closeNewProductPopup.addEventListener("click", closeNewProduct);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeNewProduct);

// กด Enter ในช่องราคา = บันทึก
if (npPrice) {
  npPrice.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      npSave.click();
    }
  });
}

if (npSave) {
  npSave.addEventListener("click", () => {
    const codeStr = (npCode.value || "").trim();
    let nameStr = (npName.value || "").trim();
    const priceNum = parseFloat(npPrice.value);

    if (!priceNum || priceNum <= 0) {
      npError.textContent = "กรุณาใส่ราคาให้ถูกต้อง (> 0)";
      npError.style.display = "block";
      npPrice.focus();
      return;
    }
    if (!nameStr) nameStr = "สินค้าอื่นๆ";

    // เพิ่มลงตารางขายทันที (ฟังก์ชัน addProductbox ต้องมีอยู่แล้วในโปรเจกต์คุณ)
    // รูปแบบนี้จะส่ง (ราคา, ชื่อ)
    addProductbox(priceNum, nameStr, codeStr);

    // อัปเดตฐานข้อมูลสินค้าภายในหน้านี้ (จะค้นหาเจอครั้งถัดไป)
    productData.push({ code: codeStr, name: nameStr, price: priceNum });

    // บันทึกไปยัง Google Sheet ผ่าน Apps Script
    // !!! แก้ URL ให้เป็น Apps Script Web App ของคุณที่ใช้อยู่ !!!
    sendNewProductToSheet(codeStr, nameStr, priceNum);

    // ปิด popup
    closeNewProduct();
  });
}
// ===================== End Popup =====================

// ----------- เขียนสินค้าใหม่ไปยัง Google Sheet -------------
// ใช้ endpoint เดียวกับการบันทึกยอดขายของคุณ (รองรับพารามิเตอร์ sheet)
function sendNewProductToSheet(code, name, price) {
  const payload = {
    sheet: "รายการสินค้า",
    code: code,
    name: name,
    price: price
  };

  const simpleBody = "data=" + encodeURIComponent(JSON.stringify(payload));

  fetch("https://script.google.com/macros/s/AKfycbz8kNKW-lLc3PxD-4MtzLWm_EJ40sn5s0-ihgc8sa-UO5RYHNhtsn0tns1j_bO8n9D2OQ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: simpleBody,
    mode: "no-cors"
  }).catch(err => console.error("❌ ส่งสินค้าใหม่ไม่สำเร็จ:", err));
}


// ตัวอย่างการยิงข้อมูลสินค้าใหม่ไป Google Sheet
// const payload = {
//   sheet: "รายการสินค้า",
//   code: "123456",
//   name: "สินค้าอื่นๆ",  // เว้นว่างได้ เดี๋ยวฝั่ง Apps Script จะตั้งให้เอง
//   price: 25
// };
// const body = "data=" + encodeURIComponent(JSON.stringify(payload));

// fetch("https://script.google.com/macros/s/AKfycbwZGY23pGHlopc5O7pzxowOGqAJBhlNI9ge2cpbrM15SfJ30EcHfuxDmZJwkWkvV9-O6g/exec", {
//   method: "POST",
//   headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
//   body,
//   mode: "no-cors"
// });


function updateProductInSheet(code, name, price) {
  if (!code) return;
  const payload = {
    action: "update_product",
    sheet: "รายการสินค้า",
    code: code,
    name: name,
    price: price
  };
  const body = "data=" + encodeURIComponent(JSON.stringify(payload));

  fetch("https://script.google.com/macros/s/AKfycbz8kNKW-lLc3PxD-4MtzLWm_EJ40sn5s0-ihgc8sa-UO5RYHNhtsn0tns1j_bO8n9D2OQ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
    mode: "no-cors"
  }).catch(err => console.error("❌ อัปเดตสินค้าไม่สำเร็จ:", err));
}



function getBoxForItem(item) {
  if (!item) return null;
  const boxes = addbox.querySelectorAll('.addProduct');
  for (const box of boxes) {
    if (box._productItem === item) return box;
  }
  return null;

}

// --- ระบบ Keypad ---
let activeKeypadInput = null; // ตัวแปรเก็บว่ากำลังพิมพ์ใส่ช่องไหน

// ฟังก์ชันหา input ทั้งหมดแล้วปิดคีย์บอร์ดมือถือ
function initKeypadSupport() {
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => {
        // สำคัญมาก: บรรทัดนี้จะบล็อคคีย์บอร์ดมือถือ
        input.setAttribute('inputmode', 'none'); 
        
        // จำว่า user กดช่องไหนล่าสุด
        input.addEventListener('focus', () => {
            activeKeypadInput = input;
        });
        
        // ถ้าคลิกที่ช่อง ให้เปิดคีย์บอร์ดเราขึ้นมาอัตโนมัติ (ถ้าต้องการ)
        input.addEventListener('click', () => {
            document.getElementById('customKeypad').style.display = 'none';
        });
    });
}

// เรียกใช้งานตอนโหลดหน้าเว็บ
window.addEventListener('DOMContentLoaded', initKeypadSupport);
// เรียกซ้ำทุก 2 วิ เผื่อมี popup สินค้าใหม่ที่สร้างทีหลัง
setInterval(initKeypadSupport, 2000); 

function toggleKeypad() {
    const keypad = document.getElementById('customKeypad');
    if (keypad.style.display === 'none') {
        keypad.style.display = 'none';
    } else {
        keypad.style.display = 'none';
    }
}

function keypadPress(key) {
    if (!activeKeypadInput) {
        // ถ้ายังไม่ได้เลือกช่อง ให้เลือกช่องรหัสสินค้าหลักเป็นค่าเริ่มต้น
        activeKeypadInput = document.getElementById('productInput');
        activeKeypadInput.focus();
    }

    if (key === 'Backspace') {
        activeKeypadInput.value = activeKeypadInput.value.slice(0, -1);
    } else {
        activeKeypadInput.value += key;
    }
    
    // Trigger event เพื่อให้ระบบรู้ว่าค่าเปลี่ยน (เผื่อมีฟังก์ชันคำนวณ)
    activeKeypadInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function keypadAction(action) {
    if (action === 'Enter') {
        if (activeKeypadInput) {
            // 1. ส่งคำสั่ง "กดปุ่ม" (Keydown)
            const downEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                which: 13,
                keyCode: 13,
                bubbles: true
            });
            activeKeypadInput.dispatchEvent(downEvent);

            // 2. ส่งคำสั่ง "ปล่อยปุ่ม" (Keyup) ตามหลังทันที
            // (สำคัญมาก! เพื่อปลดล็อคตัวแปร enterPressed ในระบบเดิมของคุณ)
            setTimeout(() => {
                const upEvent = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    code: 'Enter',
                    which: 13,
                    keyCode: 13,
                    bubbles: true
                });
                activeKeypadInput.dispatchEvent(upEvent);
            }, 50); // หน่วงเวลาเล็กน้อยให้เหมือนคนกดจริง
        }
    } else if (action === 'Pay') {
        // จำลองปุ่ม + (NumpadAdd) สำหรับเปิดหน้าชำระเงิน
        const event = new KeyboardEvent('keydown', {
            code: 'NumpadAdd',
            bubbles: true
        });
        document.dispatchEvent(event);
    }

}





