// متغيرات عامة
let currentStep = 1;
let isFormSubmitted = false;

// إدارة السؤال الأول: مدينة مصراتة
function handleMisurataQuestion(element) {
    const recipientSection = document.getElementById('recipientSection');
    const outsideMisurataMessage = document.getElementById('outsideMisurataMessage');
    const fullForm = document.getElementById('fullForm');
    const nonRecipientMessage = document.getElementById('nonRecipientMessage');
  
    // إخفاء جميع الأقسام أولاً
    hideAllSections();
  
    if (element.value === 'نعم') {
        // إظهار السؤال الثاني
        showSection(recipientSection);
        currentStep = 2;
    } else {
        // إظهار رسالة للمستخدمين من خارج مصراتة
        showSection(outsideMisurataMessage);
        currentStep = 'end';
    }
}

// إدارة السؤال الثاني: مستلم الزكاة
function handleRecipientQuestion(element) {
    const fullForm = document.getElementById('fullForm');
    const nonRecipientMessage = document.getElementById('nonRecipientMessage');
  
    // إخفاء الرسائل السابقة
    hideElement(nonRecipientMessage);
    hideElement(fullForm);
  
    if (element.value === 'نعم') {
        // إظهار النموذج الكامل
        showSection(fullForm);
        currentStep = 3;
      
        // إضافة تأثير متدرج لظهور الأقسام
        animateFormSections();
    } else {
        // إظهار رسالة لغير مستلمي الزكاة
        showSection(nonRecipientMessage);
        currentStep = 'end';
    }
}

// إدارة حقول "أخرى" للراديو
function toggleOtherField(element, fieldId) {
    const otherField = document.getElementById(fieldId);
  
    if (element.checked && (element.value === 'أخرى' || element.value === 'غير ذلك')) {
        showOtherField(otherField);
    } else {
        // إخفاء حقول "أخرى" عند اختيار خيار آخر في نفس المجموعة
        const radioGroup = document.querySelectorAll(`input[name="${element.name}"]`);
        const isOtherSelected = Array.from(radioGroup).some(radio =>
            radio.checked && (radio.value === 'أخرى' || radio.value === 'غير ذلك')
        );
      
        if (!isOtherSelected) {
            hideOtherField(otherField);
        }
    }
}

// إدارة حقول "أخرى" للشيك بوكس
function toggleOtherFieldCheckbox(element, fieldId) {
    const otherField = document.getElementById(fieldId);
  
    if (element.checked && (element.value === 'أخرى' || element.value === 'غير ذلك')) {
        showOtherField(otherField);
    } else {
        hideOtherField(otherField);
    }
}

// إظهار حقل "أخرى"
function showOtherField(field) {
    if (field) {
        field.classList.remove('hidden');
        field.classList.add('show');
      
        // التركيز على حقل النص
        const input = field.querySelector('input, textarea');
        if (input) {
            setTimeout(() => {
                input.focus();
            }, 300);
        }
    }
}

// إخفاء حقل "أخرى"
function hideOtherField(field) {
    if (field) {
        field.classList.remove('show');
        setTimeout(() => {
            field.classList.add('hidden');
        }, 300);
      
        // مسح قيمة الحقل
        const input = field.querySelector('input, textarea');
        if (input) {
            input.value = '';
        }
    }
}

// إخفاء جميع الأقسام
function hideAllSections() {
    const sections = [
        'recipientSection',
        'outsideMisurataMessage',
        'nonRecipientMessage',
        'fullForm'
    ];
  
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            hideElement(section);
        }
    });
}

// إظهار قسم مع تأثير
function showSection(element) {
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('show');
      
        // التمرير إلى القسم الجديد
        setTimeout(() => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
}

// إخفاء عنصر
function hideElement(element) {
    if (element) {
        element.classList.remove('show');
        element.classList.add('hidden');
    }
}

// تحريك أقسام النموذج عند الظهور
function animateFormSections() {
    const sections = document.querySelectorAll('#fullForm .section');
  
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
      
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// إدارة إرسال النموذج
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('zakatForm');
    const submitBtn = document.querySelector('.submit-btn');
  
    // التحقق من صحة النموذج قبل الإرسال
    form.addEventListener('submit', function(e) {
        e.preventDefault();
      
        if (isFormSubmitted) {
            return;
        }
      
        // التحقق من أن جميع الحقول المطلوبة مُملأة
        if (validateForm()) {
            submitForm();
        } else {
            showValidationError();
        }
    });
  
    // تحسين تجربة المستخدم مع الخيارات
    setupOptionAnimations();
  
    // إضافة مستمعي الأحداث لحقول "أخرى"
    setupOtherFieldListeners();
});

// التحقق من صحة النموذج
function validateForm() {
    const requiredFields = document.querySelectorAll('#fullForm input[required]');
    let isValid = true;
  
    // التحقق من الحقول المطلوبة الأساسية
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = document.querySelectorAll(`input[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                highlightRequiredField(field);
            }
        } else if (!field.value.trim()) {
            isValid = false;
            highlightRequiredField(field);
        }
    });
  
    // التحقق من أن الحقول متعددة الخيارات تحتوي على خيار واحد على الأقل
    const checkboxGroups = ['delivery_type', 'usage'];
    checkboxGroups.forEach(groupName => {
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="${groupName}"]`);
        const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        if (!isAnyChecked) {
            isValid = false;
            // تمييز المجموعة كاملة
            const firstCheckbox = checkboxes[0];
            if (firstCheckbox) {
                highlightRequiredField(firstCheckbox);
            }
        }
    });
  
    return isValid;
}

// تمييز الحقول المطلوبة غير المُملأة
function highlightRequiredField(field) {
    const questionGroup = field.closest('.question-group') || field.closest('.section');
    if (questionGroup) {
        questionGroup.style.border = '2px solid #ef4444';
        questionGroup.style.borderRadius = '10px';
        questionGroup.style.animation = 'shake 0.5s ease-in-out';
      
        setTimeout(() => {
            questionGroup.style.border = '';
            questionGroup.style.animation = '';
        }, 2000);
    }
}

// إظهار رسالة خطأ في التحقق
function showValidationError() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        color: #dc2626;
        padding: 15px 20px;
        border-radius: 10px;
        border: 2px solid #fca5a5;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.5s ease;
    `;
    errorMessage.textContent = 'يرجى الإجابة على جميع الأسئلة المطلوبة';
  
    document.body.appendChild(errorMessage);
  
    setTimeout(() => {
        errorMessage.remove();
    }, 4000);
}

// إرسال النموذج
async function submitForm() {
    const form = document.getElementById('zakatForm');
    const submitBtn = document.querySelector('.submit-btn');
  
    // تغيير حالة الزر
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">جاري الإرسال...</span>';
    submitBtn.style.background = '#9ca3af';
  
    try {
        // إرسال البيانات
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
      
        if (response.ok) {
            // نجح الإرسال
            isFormSubmitted = true;
            showThankYouMessage();
        } else {
            throw new Error('فشل في إرسال النموذج');
        }
    } catch (error) {
        console.error('خطأ في إرسال النموذج:', error);
        showSubmissionError();
    } finally {
        // إعادة تعيين الزر
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">إرسال الاستبيان</span><span class="btn-icon">←</span>';
        submitBtn.style.background = '';
    }
}

// إظهار رسالة الشكر
function showThankYouMessage() {
    const form = document.getElementById('zakatForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
  
    // إخفاء النموذج
    form.style.transition = 'all 0.8s ease';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-30px)';
  
    setTimeout(() => {
        form.classList.add('hidden');
      
        // إظهار رسالة الشكر
        thankYouMessage.classList.remove('hidden');
        thankYouMessage.style.opacity = '0';
        thankYouMessage.style.transform = 'translateY(30px)';
      
        setTimeout(() => {
            thankYouMessage.style.transition = 'all 0.8s ease';
            thankYouMessage.style.opacity = '1';
            thankYouMessage.style.transform = 'translateY(0)';
        }, 100);
      
        // التمرير إلى الأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
}

// إظهار رسالة خطأ الإرسال
function showSubmissionError() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'submission-error';
    errorMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fee2e2;
        color: #dc2626;
        padding: 25px 30px;
        border-radius: 15px;
        border: 2px solid #fca5a5;
        font-weight: 600;
        text-align: center;
        z-index: 1000;
        max-width: 400px;
        animation: fadeInScale 0.5s ease;
    `;
    errorMessage.innerHTML = `
        <h3 style="margin-bottom: 10px;">حدث خطأ في الإرسال</h3>
        <p>يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني</p>
    `;
  
    document.body.appendChild(errorMessage);
  
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// إعداد تحريك الخيارات
function setupOptionAnimations() {
    const options = document.querySelectorAll('.option-item');
  
    options.forEach(option => {
        const input = option.querySelector('input[type="radio"], input[type="checkbox"]');
        const box = option.querySelector('.option-box');
      
        if (input) {
            input.addEventListener('change', function() {
                // للراديو: إزالة التحديد من الخيارات الأخرى في نفس المجموعة
                if (this.type === 'radio') {
                    const groupName = this.name;
                    const groupOptions = document.querySelectorAll(`input[name="${groupName}"]`);
                  
                    groupOptions.forEach(radio => {
                        const radioBox = radio.closest('.option-item').querySelector('.option-box');
                        if (radio !== this) {
                            radioBox.classList.remove('selected');
                        }
                    });
                }
              
                // إضافة/إزالة كلاس التحديد
                if (this.checked) {
                    box.classList.add('selected');
                } else {
                    box.classList.remove('selected');
                }
            });
        }
    });
}

// إعداد مستمعي الأحداث لحقول "أخرى"
function setupOtherFieldListeners() {
    const otherOptions = document.querySelectorAll('input[value="أخرى"], input[value="غير ذلك"]');
  
    otherOptions.forEach(option => {
        option.addEventListener('change', function() {
            const fieldId = this.getAttribute('onchange')?.match(/toggleOther\w+\(this, '([^']+)'\)/)?.[1];
            if (fieldId) {
                if (this.type === 'checkbox') {
                    toggleOtherFieldCheckbox(this, fieldId);
                } else {
                    toggleOtherField(this, fieldId);
                }
            }
        });
    });
}