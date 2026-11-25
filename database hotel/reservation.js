// مصفوفة لتخزين الحجوزات (بتجيب البيانات المحفوظة أو تبدأ فاضية)
let reservations = JSON.parse(localStorage.getItem('hotel_reservations')) || [];
const TOTAL_ROOMS = 20; // إجمالي غرف الفندق الافتراضي

// عناصر الصفحة
const form = document.getElementById('reservation-form');
const tableBody = document.getElementById('reservations-table-body');
const totalResEl = document.getElementById('total-res');
const availableRoomsEl = document.getElementById('available-rooms');
const editIndexInput = document.getElementById('edit-index');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const formTitle = document.getElementById('form-title');

// دالة لتحديث الجدول والأعداد
function renderReservations() {
    tableBody.innerHTML = '';

    reservations.forEach((res, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${res.customerName}</td>
            <td>Room ${res.roomNumber}</td>
            <td>${res.checkIn}</td>
            <td>${res.checkOut}</td>
            <td>
                <button class="btn-edit" onclick="editReservation(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteReservation(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // تحديث الأعداد
    totalResEl.textContent = reservations.length;
    availableRoomsEl.textContent = Math.max(0, TOTAL_ROOMS - reservations.length);

    // حفظ في المتصفح عشان الأعداد تسمّع في باقي الصفحات
    localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
}

// عند إرسال الفورم (إضافة أو حفظ تعديل)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const customerName = document.getElementById('customer-name').value;
    const roomNumber = document.getElementById('room-number').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const editIndex = parseInt(editIndexInput.value);

    const reservationData = { customerName, roomNumber, checkIn, checkOut };

    if (editIndex === -1) {
        // إضافة حجز جديد
        reservations.push(reservationData);
    } else {
        // تعديل حجز موجود
        reservations[editIndex] = reservationData;
        resetFormMode();
    }

    form.reset();
    renderReservations();
});

// دالة المسح (Delete)
function deleteReservation(index) {
    if (confirm('Are you sure you want to delete this reservation?')) {
        reservations.splice(index, 1);
        renderReservations();
    }
}

// دالة التعديل (Edit) - بترفع البيانات للفورم فوق
function editReservation(index) {
    const res = reservations[index];
    document.getElementById('customer-name').value = res.customerName;
    document.getElementById('room-number').value = res.roomNumber;
    document.getElementById('check-in').value = res.checkIn;
    document.getElementById('check-out').value = res.checkOut;

    editIndexInput.value = index;
    formTitle.textContent = `Edit Reservation #${index + 1}`;
    submitBtn.textContent = 'Save Changes';
    cancelEditBtn.style.display = 'inline-block';
}

// إلغاء وضع التعديل
cancelEditBtn.addEventListener('click', resetFormMode);

function resetFormMode() {
    form.reset();
    editIndexInput.value = -1;
    formTitle.textContent = 'New Reservation';
    submitBtn.textContent = 'Confirm Reservation';
    cancelEditBtn.style.display = 'none';
}

// تشغيل العرض أول ما الصفحة تفتح
renderReservations();
