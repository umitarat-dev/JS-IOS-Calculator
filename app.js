//* =====================================
//*             IOS Calculator
//* =====================================

//! Ekranlar için gerekli elementlerin seçilmesi
const preDisp = document.querySelector('.previous-display');
const currDisp = document.querySelector('.current-display');

//! Butonları taşıyan container için gerekli elementin seçilmesi
const btnContainer = document.querySelector('.buttons-container');

//! Ara değerler için değişkenlerin tanımlanması
let currOperand = '';
let previousOperand = '';
let operation = '';

//! Eşittir ve yüzde ekranların başlangıç değerlerinin ayarlanması
let equalOrPercentSign = false;

//! Buttonları taşıyan container için click event listener tanımlanması
btnContainer.addEventListener('click', (e) => {
    // console.log(e.target) // tıklanan elementin bilgilerini alır
    //! Herhangi bir sayı(num) butonuna tıklanırsa
    if(e.target.classList.contains('num')) {
        // console.log(e.target.textContent);
        appendNumber(e.target.textContent);
        updateDisplay();
    }
    
    //! Herhangi bir operator(+,-,x,÷) butonuna tıklanırsa
    if(e.target.classList.contains('operator')) {
        chooseOperator(e.target.textContent);
        updateDisplay();
    }

    //! eşittir(=) butonuna tıklanırsa
    if(e.target.classList.contains('equal')) {
        claculate();
        updateDisplay();
        equalOrPercentSign = true; // Eşittir butonuna tıklanırsa, bu değişken true olur
    }

    //! AC butonuna tıklanırsa
    if(e.target.classList.contains('ac')) {
        previousOperand = '';
        currOperand = '';
        operation = '';
        updateDisplay();
    }

    //! PM(±) butonuna tıklanırsa
    if(e.target.classList.contains('pm')) {
        if (!currOperand) return; // Eğer currOperand boşsa geri dön
        currOperand *= -1; // Negate the current operand
        updateDisplay();
    }

    //! Percent(%) butonuna tıklanırsa
    if(e.target.classList.contains('percent')) {
        if (!currOperand) return; // Eğer currOperand boşsa geri dön
        currOperand = currOperand / 100; // Percent calculation
        updateDisplay();
        equalOrPercentSign = true; // Yüzde butonuna tıklanırsa, bu değişken true olur

    }
});

const appendNumber = (num) => {
    //! Eğer ilk olarak 0 girilmişse geri dön / 0. ile devam et
    // if (currOperand === "" && num === "0") return; // Prevent leading zero
    // if (!currOperand && num === "0") return; // Prevent leading zero
    // if (!currOperand && num === "0") // Eğer 0 ile başlıyorsa 0. ile devam et
        // num = "0."
    if (currOperand === "0" && num !== ".") { // Eğer sayı 0 ile başlıyorsa ve arkasından "." gelmiyorsa -> num'u currOperand'a ata
        currOperand = num;
        return;
    }

    //! Eğer şuanki sayı "." ise ve önceki girilen sayı "."içeriyorsa geri dön
    if (num === '.' && currOperand.includes('.')) return; // Prevent multiple decimal points

    //! Girilen sayı hanesini sınırlandırma
    if (currOperand.length > 10) return; // Limit to 11 digits


    //! eşittir veya yüzde butonuna tıklanmışsa, currOperand'ı temizle
    //! 1.yol
    // if (equalOrPercentSign) {
    //         currOperand = ''; // Eğer eşittir veya yüzde butonuna tıklanmışsa, currOperand'ı temizle
    //         equalOrPercentSign = false; // Eşittir veya yüzde butonuna tıklanma durumunu sıfırla
    //     }
        
    //! 2.yol
    if (equalOrPercentSign) {
        currOperand = num; // Eğer eşittir veya yüzde butonuna tıklanmışsa, currOperand'ı temizle ve yeni num'u ata
        equalOrPercentSign = false; // Eşittir veya yüzde butonuna tıklanma durumunu sıfırla
        return; // Eşittir veya yüzde butonuna tıklanmışsa, currOperand'ı temizle ve geri dön
    }

    //! Girilen sayıları currOperand'a ekle
    currOperand += num;
};

const updateDisplay = () => {
    //! 1. Basamak Sınırlandırma ve Üslü Sayı Gösterimi
    if (currOperand.toString().length > 11) {
        currOperand = Number(currOperand).toExponential(4); // Limit to 11 digits and convert to exponential notation if necessary
    }

    //! 2. Sayıyı Formatlama (toLocaleString Dokunuşu)
    if (currOperand === "" || currOperand === "-") {
        // Eğer ekran boşsa veya sadece eksi işareti varsa formatlama yapma
        currDisp.textContent = currOperand;
    } else if (currOperand.toString().includes(".")) {
        // Eğer kullanıcı ondalık sayı giriyorsa (nokta varsa), 
        // toLocaleString noktadan sonrasını uçurabilir. 
        // Bu yüzden yazım anında formatlamayı pas geçiyoruz veya string olarak bırakıyoruz.
        currDisp.textContent = currOperand;
    } else {
        // Normal sayıları binlik ayraçlarla formatla
        currDisp.textContent = Number(currOperand).toLocaleString('en-US', {
            maximumFractionDigits: 10 // Virgülden sonraki hassasiyet
        });
    }

    //! 3. Üst Ekran (Previous Display) Güncelleme
    if (operation && previousOperand) {
        // Üst ekrandaki sayıyı da formatlı gösterelim
        const formattedPrev = Number(previousOperand).toLocaleString('en-US');
        preDisp.textContent = `${formattedPrev} ${operation}`;
    } else {
        preDisp.textContent = '';
    }
};

const chooseOperator = (op) => {
    // console.log(op); // test ediyoruz tıklanan operatörü alır
    //! Eğer ilk sayı girişi carsa hesaplama işlemi yap. sayı girişi yapıldıktan sonra operatör tıklanırsa ve currOperand boş değilse, önceki operand ile işlem yap
    if (previousOperand && currOperand) {
        // Eğer önceki operand varsa, işlem yap ve sonucu currOperand'a ata
        claculate();
    }

    //! Değişken swapping
    operation = op;
    previousOperand = currOperand;
    currOperand = ''; 
};

const claculate = () => {
    let calculation;
    // const prev = parseFloat(previousOperand);
    // const curr = parseFloat(currOperand);
    const prev = Number(previousOperand);
    const current = Number(currOperand);
    
    // console.log(prev, current);

    switch (operation) {
        case '+':
            calculation = prev + current;
            break;
        case '-':
            calculation = prev - current;
            break;
        case 'x':
            calculation = prev * current;
            break;
        case '÷':
            calculation = prev / current;
            break;
        default:
            return; // Eğer işlem tanımlanmamışsa geri dön
    }
    // console.log(calculation)
    currOperand = calculation; 
    //! eşittir butonuna tıklanınca, previousOperand ve operation,'ı silmeliyiz.
    previousOperand = ''; // Önceki operandı temizle
    operation = ''; // İşlemi temizle
};
