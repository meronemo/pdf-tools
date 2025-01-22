['merge', 'unlock'].forEach(type => {
    const form = document.querySelector(`#${type} form`);
    const dropArea = document.getElementById(`${type}-drop-area`);
    const fileInput = document.getElementById(`${type}-files`) || document.getElementById(`${type}-file`);
    const fileList = document.getElementById(`${type}-file-list`);
    const insertBlank = document.getElementById('insert-blank');
    const fileName = document.getElementById('file-name');

    dropArea.addEventListener('click', () => fileInput.click());

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.style.background = 'var(--color-accent)';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.background = '';
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.style.background = '';
        fileInput.files = e.dataTransfer.files;
        updateFileList(type, fileInput.files, fileList);
    });

    fileInput.addEventListener('change', () => {
        updateFileList(type, fileInput.files, fileList);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!fileInput.files.length) {
            alert("파일을 업로드해주세요.");
            return;
        }
        if (type === 'merge' && fileInput.files.length < 2) {
            alert("2개 이상의 파일을 업로드해주세요.");
            return;
        }

        form.submit();
        fileInput.value = '';
        fileList.innerHTML = '';
        insertBlank.checked = false;
        fileName.value = '';
        updateFileList(type, fileInput.files, fileList);

    });

    if (type === 'merge') {
        new Sortable(fileList, {
            animation: 150,
            onEnd: () => {
                const order = Array.from(fileList.children).map((li) => li.dataset.index);
                document.getElementById('file-order').value = order.join(' ');
            },
        });
    }
});

function updateFileList(type, files, fileList) {
    fileList.innerHTML = '';
    Array.from(files).forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        if (type === 'merge') {
            li.dataset.index = index;
            li.setAttribute('draggable', 'true');
        } else if (type === 'unlock') {
            document.getElementById('unlock-file-name').value = encodeURIComponent(file.name);
        }
        fileList.appendChild(li);
    });

    if (type === 'merge') {
        const initialOrder = Array.from(fileList.children).map((li) => li.dataset.index);
        document.getElementById('file-order').value = initialOrder.join(' ');
    }
}