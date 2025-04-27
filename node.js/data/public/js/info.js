const searchInput = document.getElementById('searchInput');
const infoList = document.getElementById('infoList');
const listItems = infoList.getElementsByTagName('li');

searchInput.addEventListener('keyup', function() {
  const filter = searchInput.value.toLowerCase();
  
  for (let i = 0; i < listItems.length; i++) {
    const text = listItems[i].textContent || listItems[i].innerText;
    if (text.toLowerCase().includes(filter)) {
      listItems[i].style.display = "";
    } else {
      listItems[i].style.display = "none";
    }
  }
});
