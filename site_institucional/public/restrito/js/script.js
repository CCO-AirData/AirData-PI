var dropdownUser = document.getElementById("dropdownUser");
var areaUser = document.getElementById("area_user");

isDropdownUserOpen = false;

areaUser.addEventListener('click', () => {
    if(isDropdownUserOpen) {
        dropdownUser.style.display = 'none';
        isDropdownUserOpen = false;
    } else {
        dropdownUser.style.display = 'block';
        isDropdownUserOpen = true;
    }
})

var navLink = document.getElementById("")