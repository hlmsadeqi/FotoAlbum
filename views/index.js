function handleEdit(id,element) {
    console.log(element);
    alert("id"+id);

    element.disabled = true ;
    document.getElementById("save-"+id).disabled = false;

    let description = document.getElementById("description-"+id);
    description.readOnly = false ;

    let select = document.getElementById("select-"+id);
    select.disabled = false ;

    let name = document.getElementById("name-"+id);
    name.disabled = false ;
}



function handleSave(id,element) {
    console.log(element);
    element.disabled = true ;
    document.getElementById("edit-"+id).disabled = false;
    
    let description = document.getElementById("description-"+id);
    description.readOnly = true ;

    let select = document.getElementById("select-"+id);
    select.disabled = true ;
    
    let name = document.getElementById("name-"+id);
    name.readOnly = true ;
    if(select.value==="Deleted"){
        
        userAction({  active: 0,bild_id: id,description:description.value,name: name.value});
    }else{
        userAction({  active: 1,bild_id: id,description:description.value,name: name.value});
    }
    
}
const userAction = async (bodys) => {
    console.log(bodys);
    console.log(JSON.stringify(bodys));
    const response = await fetch(window.location.origin+'/update', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodys)
        });
       
   // const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
  }