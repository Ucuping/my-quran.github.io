(async function() {
    try {
        const allSurat = await getAllSurat();
        updateAllSurat(allSurat);
        const suratError = document.querySelector('.surat-error');
        if(suratError.classList.contains('alert', 'alert-danger')) {
            suratError.classList.remove('alert', 'alert-danger');
            suratError.innerHTML = '';
        }
    } catch (error) {
        const suratError = document.querySelector('.surat-error');
        suratError.classList.add('alert', 'alert-danger');
        suratError.innerHTML = error;
    }
})();

function getAllSurat() {
    return fetch('https://equran.id/api/surat')
    .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(response => response);
}

function updateAllSurat(allSurat) {
    let cards = '';
    allSurat.forEach(s => cards += suratCards(s));
    const suratContainer = document.querySelector('.surat-container');
    suratContainer.innerHTML = cards;
}

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function() {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const surat = await getSurat(inputKeyword.value);
        updateSurat(surat);
        const suratError = document.querySelector('.surat-error');
        if(suratError.classList.contains('alert', 'alert-danger')) {
            suratError.classList.remove('alert', 'alert-danger');
            suratError.innerHTML = '';
        }
    } catch (error) {
        const suratError = document.querySelector('.surat-error');
        suratError.classList.add('alert', 'alert-danger');
        suratError.innerHTML = error;
    }
});

function getSurat(surat) {
    return fetch('https://equran.id/api/surat/' + surat)
    .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(response => {
        if(response.status === false) {
            throw new Error(response.message);
        }
        return response;
    });
}

function updateSurat(surat) {
    if(Array.isArray(surat)) {
        let cards = '';
        surat.forEach(s => cards += suratCards(s));
        const suratContainer = document.querySelector('.surat-container');
        suratContainer.innerHTML = cards;
    } else {
        const updateSurat = suratCards(surat);
        const suratContainer = document.querySelector('.surat-container');
        suratContainer.innerHTML = updateSurat;
    }
}

document.addEventListener('click', async function(e) {
    try {
        if(e.target.classList.contains('show-detail-surat')) {
            const nomorSurat = e.target.dataset.nomorsurat;
            const suratDetail = await getSuratDetail(nomorSurat);
            updateModalSurat(suratDetail);
            const suratError = document.querySelector('.show-surat-error');
            if(suratError.classList.contains('alert', 'alert-danger')) {
                suratError.classList.remove('alert', 'alert-danger');
                suratError.innerHTML = '';
            }
        }
    } catch (error) {
        const suratError = document.querySelector('.show-surat-error');
        if(suratError !== null) {
            suratError.classList.add('alert', 'alert-danger');
            suratError.innerHTML = error;
        }
    }
})

function getSuratDetail(nomorSurat) {
    return fetch('https://equran.id/api/surat/' + nomorSurat)
    .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(response => {
        if(response.status === false) {
            throw new Error(response.message);
        }
        return response;
    });
}

function updateModalSurat(s) {
    const suratDetail = showSuratDetail(s);
    const modalDetail = document.querySelector('.modal-surat-detail');
    modalDetail.innerHTML = suratDetail;
    const modalTitle = document.querySelector('.surat-modal-title');
    modalTitle.innerHTML = s.nama_latin;
    let ayat = '';
    s.ayat.forEach(s => ayat += showAyatDetail(s));
    const ayatDetail = document.querySelector('.list-ayat');
    ayatDetail.innerHTML = ayat;
}

document.addEventListener('click', async function(e) {
    try {
        if(e.target.classList.contains('show-tafsir-surat')) {
            const nomorSurat = e.target.dataset.nomorsurat;
            const tafsirDetail = await getTafsirSurat(nomorSurat);
            updateTafsirSurat(tafsirDetail);
            const suratError = document.querySelector('.show-tafsir-error');
            if(suratError.classList.contains('alert', 'alert-danger')) {
                suratError.classList.remove('alert', 'alert-danger');
                suratError.innerHTML = '';
            }
        }
    } catch (error) {
        const suratError = document.querySelector('.show-tafsir-error');
        if(suratError !== null) {
            suratError.classList.add('alert', 'alert-danger');
            suratError.innerHTML = error;
        }
    }
})

function getTafsirSurat(nomorSurat) {
    return fetch('https://equran.id/api/tafsir/' + nomorSurat)
    .then(response => {
        if(!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(response => {
        if(response.status === false) {
            throw new Error(response.message);
        }
        return response;
    });
}

function updateTafsirSurat(t) {
    const tafsirModalTitle = document.querySelector('.tafsir-modal-title');
    tafsirModalTitle.innerHTML = t.nama_latin;
    let tafsirList = '';
    t.tafsir.forEach(tafsir => tafsirList += showTafsirDetail(tafsir));
    const tafsirDetail = document.querySelector('.modal-tafsir-detail');
    tafsirDetail.innerHTML = tafsirList;
}

function suratCards(s) {
    return `<div class="col-md-3 mt-4 lazy" loading="lazy">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${s.nama}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${s.nama_latin}</h6>
                        <div class="card-text">
                            <h6 class="text-muted">Jumlah ayat: ${s.jumlah_ayat} Ayat</h6>
                            <h6 class="text-muted">Turun di: ${s.tempat_turun}</h6>
                            <h6 class="text-muted">Artinya: ${s.arti}</h6>
                            <h6 class="text-muted">Surat ke: ${s.nomor}</h6>
                        </div>
                        <button class="btn btn-success show-detail-surat mt-2" type="button" data-toggle="modal" data-target="#modal-surat" data-nomorsurat="${s.nomor}">Detail</button>
                        <button class="btn btn-success show-tafsir-surat mt-2" type="button" data-toggle="modal" data-target="#modal-tafsir" data-nomorsurat="${s.nomor}">Tafsir</button>
                    </div>
                </div>
            </div>`;
}

function showSuratDetail(s) {
    return `<div class="container-fluid">
                <audio controls class="mx-auto d-block res-audio">
                    <source src="${s.audio}" type="audio/mpeg">
                </audio>
                <div class="row list-ayat">
                    
                </div>
            </div>`;
}

function showAyatDetail(ayat) {
    return `<div class="col-md-8 mt-3 mx-auto">
                <ul class="list-group mt-2">
                <li class="list-group-item"><strong>Ayat: </strong>${ayat.nomor}</li>
                <li class="list-group-item"><strong>Arrab: </strong>${ayat.ar}</li>
                <li class="list-group-item"><strong>Terjemahan: </strong>${ayat.tr}</li>
                <li class="list-group-item"><strong>Artinya: </strong>${ayat.idn}</li>
                </ul>
            </div>`;
}

function showTafsirDetail(t) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md">
                        <ul class="list-group mt-2 scrollspy-example" data-spy="scroll" data-offset="0">
                            <li class="list-group-item"><strong>Ayat: </strong>${t.ayat}</li>
                            <li class="list-group-item"><strong>Tafsir: </strong>${t.tafsir}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}