const url = 'https://simple1-5b959-default-rtdb.asia-southeast1.firebasedatabase.app/'
async function start() {
  let data = await getData()
  printData(data);
}
start();
async function getData() {
  let res = await fetch(url + 'employee.json');
  if (res.status == 200) {
    let re = await res.json();
    return re;
  } else {
    return {
      message: "Exception while fetching"
    }
  }

}

function printData(data) {
  let container = createContainer();
  let empDiv = paintEmployee(data);
  container.appendChild(empDiv);
  document.body.appendChild(container)

}
function createContainer() {
  let main = document.createElement('div');
  main.id = 'main';
  let title = document.getElementsByTagName('title');
  title[0].innerHTML = 'JS App';

  let headin = document.createElement('h3');
  headin.innerHTML = "JS App practice"
  main.appendChild(headin)
  return main;
}
function getMainContainer() {
  return document.getElementById('main');
}
function addKeyValToView(key, index, totalLen, data) {
  let fieldDiv = document.createElement('div');
  fieldDiv.id = key;
  let keyDiv = document.createElement('div')
  keyDiv.innerHTML = key;
  keyDiv.classList.add('key-div')
  fieldDiv.appendChild(keyDiv);
  let valDiv = document.createElement('div');
  valDiv.innerHTML = data[`${key}`]
  valDiv.classList.add('val-div')
  fieldDiv.appendChild(valDiv);
  fieldDiv.classList.add('single-field')
  if (index === totalLen - 1) {
    fieldDiv.classList.add('border-bottom-none')
  }
  let opDiv = document.createElement('div');
  opDiv.classList.add('user-ops')
  let iconI = document.createElement('i');
  iconI.classList.add('fas')
  iconI.classList.add('fa-edit')
  iconI.addEventListener('click', () => {
    fieldDiv.classList.add('under-edit');
    let editModeKey = document.createElement('input');
    editModeKey.id = 'under-edit-field';
    editModeKey.value = key;
    editModeKey.addEventListener('change', e => {
      editModeKey.value = e.target.value
    })
    let editModeVal = document.createElement('input');
    editModeVal.value = data[`${key}`];
    editModeVal.id = 'under-edit-field-val';
    editModeVal.addEventListener('change', e => {
      editModeVal.value = e.target.value
    })
    keyDiv.replaceWith(editModeKey);
    valDiv.replaceWith(editModeVal);
    let icons = fieldDiv.children[2]
    icons.remove();
    let tickIcon = document.createElement('div');
    tickIcon.classList.add('user-ops')
    let icon = document.createElement('i');
    icon.classList.add('fas')
    icon.classList.add('fa-check');
    icon.id = 'tick-icon'
    tickIcon.appendChild(icon)
    fieldDiv.appendChild(tickIcon);
    tickIcon.addEventListener('click', () => {
      updateFieldInDb(key, editModeKey.value, data, editModeVal.value, index)
    })
  })

  opDiv.appendChild(iconI);
  let iconIDel = document.createElement('i');
  iconIDel.classList.add('fas')
  iconIDel.classList.add('fa-minus-square')
  iconIDel.addEventListener('click', () => {
    removeField(key);
  })
  opDiv.appendChild(iconIDel);
  let addIcon = document.createElement('i');
  addIcon.id = 'add-icon'
  addIcon.classList.add('far')
  addIcon.classList.add('fa-plus-square');
  addIcon.id = 'add-icon'
  addIcon.addEventListener('click', () => {
    addNewField()
  })
  if (index === totalLen - 1) {
    opDiv.append(addIcon)
  }
  fieldDiv.appendChild(opDiv);
  return fieldDiv
}
function paintEmployee(data) {
  let keys = Object.keys(data);
  let localDiv = document.createElement('div');
  localDiv.id = 'emp-div';
  localDiv.classList.add('one-emp')
  keys.map((key, index) => {
    let singleKeyDiv = addKeyValToView(key, index, keys.length, data)
    localDiv.appendChild(singleKeyDiv)
  })


  return localDiv
}
async function removeField(key) {
  let data = await getData();
  delete data[`${key}`];
  let removeRes = await fetch(url + 'employee.json', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  let res = await removeRes.json();
  removeDivWithId(key);
}
function removeDivWithId(key) {
  let keySDiv = document.getElementById(key)
  keySDiv.remove()

}
function addNewField() {
  let newField = document.createElement('div');
  newField.id = 'new-field-to-be-added'
  let field = document.createElement('div');
  field.innerHTML = "Enter Field name";
  newField.appendChild(field);
  let inputF = document.createElement('input');
  inputF.addEventListener('change', (e) => {
    inputF.value = e.target.value;
    console.log(inputF.value)
  })
  inputF.id = 'new-field-name';
  newField.appendChild(inputF)
  field.classList.add('new-field');
  let val = document.createElement('div');
  val.innerHTML = "Enter Value";
  newField.appendChild(val);
  let inputV = document.createElement('input');
  inputV.id = 'new-field-val';
  inputV.addEventListener('change', (e) => {
    inputV.value = e.target.value;
    console.log(inputV.value)
  })
  newField.appendChild(inputV)
  let button = document.createElement('button');
  button.innerHTML = 'Save';
  button.id = 'new-field-save';
  button.onclick = function () {
    addNewFieldToDb()
  }
  newField.appendChild(button)
  newField.classList.add('new-field-form')
  let mainDiv = getMainContainer();
  mainDiv.append(newField)
}
async function addNewFieldToDb() {
  let field = document.getElementById('new-field-name');
  let fieldval = document.getElementById('new-field-val');
  let data = await getData();
  data[`${field.value}`] = fieldval.value;
  saveNewobjToDb(data, field.value)

}
async function saveNewobjToDb(data, field) {
  let addedObj = await fetch(url + 'employee.json', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  let res = await addedObj.json();
  addNewFieldToView(data, field)
}
function addNewFieldToView(data, field) {
  let empDiv = document.getElementById('emp-div');
  let singleKeyDiv = addKeyValToView(field, Object.keys(data).length, Object.keys(data).length, data)
  empDiv.appendChild(singleKeyDiv);
  let toremoveDiv = document.getElementById('new-field-to-be-added')
  toremoveDiv.remove()
  updateStyles()

}
function updateStyles() {
  let empDiv = document.getElementById('emp-div');
  let lastChild = empDiv.lastChild;
  let childs = empDiv.children;
  let addicon = document.getElementById('add-icon');
  addicon.remove()
  for (let i of childs) {
    i.classList.remove('border-bottom-none')
  }
  lastChild.classList.add('border-bottom-none');
  let toAddPlusDiv = lastChild.children
  toAddPlusDiv = toAddPlusDiv[toAddPlusDiv.length - 1]
  let addIconNew = document.createElement('i');
  addIconNew.id = 'add-icon'
  addIconNew.classList.add('far')
  addIconNew.classList.add('fa-plus-square');
  addIconNew.id = 'add-icon'
  addIconNew.addEventListener('click', () => {
    addNewField()
  })
  toAddPlusDiv.append(addIconNew)
}


async function updateFieldInDb(key, newKey, data, newval, index) {
  let toSaveData = data;
  delete toSaveData[`${key}`];
  toSaveData[`${newKey}`] = newval;
  let resImm = await fetch(url + 'employee.json', {
    method: 'PUT',
    body: JSON.stringify(toSaveData)
  })
  let res = await resImm.json();
  replaceFieldInView(key, newKey, newval, res, index)
}
function replaceFieldInView(key, newKey, newval, data, index) {
  let underEditDiv = document.getElementsByClassName('under-edit');
  underEditDiv[0].replaceWith(addKeyValToView(newKey, index, Object.keys(data).length, data))

}