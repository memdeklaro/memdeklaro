var loaded_libs = [];

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector("#id_number").value = generate_id_number();
  document.querySelector("#issued").value = generate_issuance_date();
  document.querySelector("#expiry").value = generate_expiry_date();
});

function load_image(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute("crossorigin", "anonymous");
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function load_lib(name) {
  return new Promise((resolve, reject) => {
    if(loaded_libs.includes(name)) {
      resolve(true);
    }
    if(!loaded_libs.includes(name)) {
      loaded_libs.push(name);
      let script = document.createElement("script");
      script.src = "https://memdeklaro.github.io/memdeklaro/app/"+name+".js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = reject;
      document.body.append(script);
    }
  });
}

function generate_id_number() {
  return ""+Math.floor(1000000000 + (Math.random() * 9000000000));
}

function generate_issuance_date() {
  return new Date().getFullYear() + "-" + ("0" + (new Date().getMonth()+1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2);
}

function generate_expiry_date() {
  return (parseInt(new Date().getFullYear()) + 5) + "-" + ("0" + (new Date().getMonth()+1)).slice(-2) + "-" + ("0" + new Date().getDate()).slice(-2);
}

function generate_checksum(str) {
  var counter = 0;
  var total = 0;
  for(var i = 0; i < str.length; i++) {
    if(counter == 3) {
      var counter = 0;
    }
    if(counter == 0) {
      var total = total + (parseInt(str[i]) * 7);
    }
    if(counter == 1) {
      var total = total + (parseInt(str[i]) * 3);
    }
    if(counter == 2) {
      var total = total + (parseInt(str[i]) * 1);
    }
    counter++;
  }
  var check_digit = total % 10;
  return check_digit;
}

function generate_mrz() {

  var first_name = document.querySelector("#first_name").value;
  var first_name = transliteration.transliterate(first_name);
  var first_name = first_name.replace(/[\-\ ]/g, "<").normalize("NFD").replace(/[^A-Z\<]/gi, "").toUpperCase();
  var surname = document.querySelector("#surname").value;
  var surname = transliteration.transliterate(surname);
  var surname = surname.replace(/[\-\ ]/g, "<").normalize("NFD").replace(/[^A-Z\<]/gi, "").toUpperCase();
  var issuer = document.querySelector("#issuer").value;
  var issuer = transliteration.transliterate(issuer);
  var issuer = issuer.replace(/[^A-Z]/gi, "").toUpperCase().slice(0,3);
  var birth_date = document.querySelector("#birth_date").value;
  var birth_date = birth_date.split("-").join("").substring(2);
  var expiry = document.querySelector("#expiry").value;
  var expiry = expiry.split("-").join("").substring(2);
  var id_number = document.querySelector("#id_number").value;

  var final = generate_checksum(id_number + generate_checksum(id_number) + birth_date + generate_checksum(birth_date) + expiry + generate_checksum(expiry));

  var mrz1 = "I<" + issuer + id_number + generate_checksum(id_number) + "<<<<<<<<<<<<<<";
  var mrz2 = birth_date + generate_checksum(birth_date) + "<" + expiry + generate_checksum(expiry) + "<<<<<<<<<<<<<<" + final;
  var mrz3 = surname + "<<" + first_name;
  if(mrz3.length >= 30) {
    var mrz3 = mrz3.slice(0, 29);
  }
  while(mrz3.length < 30) {
    var mrz3 = mrz3 + "<";
  }
  var mrz = mrz1 + "\r\n" + mrz2 + "\r\n" + mrz3;

  return mrz;

}

function generate_aamva() {

  var first_name = document.querySelector("#first_name").value;
  var first_name = transliteration.transliterate(first_name);
  var first_name = first_name.normalize("NFD").replace(/[^A-Z\ \-]/gi, "").toUpperCase();
  var surname = document.querySelector("#surname").value;
  var surname = transliteration.transliterate(surname);
  var surname = surname.normalize("NFD").replace(/[^A-Z\ \-]/gi, "").toUpperCase();
  var issuer = document.querySelector("#issuer").value;
  var issuer = transliteration.transliterate(issuer);
  var issuer = issuer.replace(/[^A-Z]/gi, "").toUpperCase().slice(0,3);
  var birth_date = document.querySelector("#birth_date").value;
  var birth_date = birth_date.split("-").join("");
  var issued = document.querySelector("#issued").value;
  var issued = issued.split("-").join("");
  var expiry = document.querySelector("#expiry").value;
  var expiry = expiry.split("-").join("");
  var id_number = document.querySelector("#id_number").value;

  var header = "@\n\x1E\rANSI 000000000001ID00000000";
  var data = "IDDAQ"+id_number+"\nDCS"+surname+"\nDAC"+first_name+"\nDBD"+issued+"\nDBB"+birth_date+"\nDBA"+expiry+"\nDCG"+issuer+"\r";
  var header_length = (new TextEncoder().encode(header)).length.toString().padStart(4, "0");
  var data_length = (new TextEncoder().encode(data)).length.toString().padStart(4, "0");
  var header = "@\n\x1E\rANSI 000000000001ID"+header_length+data_length;
  var aamva = header+data;

  return aamva;

}

function generate_did() {

  var first_name = document.querySelector("#first_name").value;
  var surname = document.querySelector("#surname").value;
  var birth_date = document.querySelector("#birth_date").value;
  var issued = document.querySelector("#issued").value;
  var expiry = document.querySelector("#expiry").value;
  var id_number = document.querySelector("#id_number").value;
  var note = document.querySelector("#note").value;
  var did_identifier = document.querySelector("#did_identifier").value;

  var did = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2"
    ],
    "type": ["VerifiableCredential", "IDCard"],
    "issuer": {
      "id": did_identifier
    },
    "identifier": id_number,
    "name": "Memdeklaro Self-Declaration of Identity",
    "description": "Generated at https://memdeklaro.github.io/memdeklaro",
    "validFrom": issued+"T00:00:00Z",
    "validUntil": expiry+"T00:00:00Z",
    "credentialSubject": {
      "id": did_identifier,
      "type": ["Person"],
      "givenName": first_name,
      "familyName": surname,
      "birthDate": birth_date,
      "note": note
    }
  };

  return did;

}

function generate_json_ld() {

  var first_name = document.querySelector("#first_name").value;
  var surname = document.querySelector("#surname").value;
  var birth_date = document.querySelector("#birth_date").value;
  var issued = document.querySelector("#issued").value;
  var expiry = document.querySelector("#expiry").value;
  var id_number = document.querySelector("#id_number").value;
  var note = document.querySelector("#note").value;

  var json_ld = {
    "type": ["IDCard"],
    "identifier": id_number,
    "name": "Memdeklaro Self-Declaration of Identity",
    "description": "Generated at https://memdeklaro.github.io/memdeklaro",
    "validFrom": issued+"T00:00:00Z",
    "validUntil": expiry+"T00:00:00Z",
    "credentialSubject": {
      "type": ["Person"],
      "givenName": first_name,
      "familyName": surname,
      "birthDate": birth_date,
      "note": note
    }
  };

  return json_ld;

}

function add_text(ctx, text, size, x, y, emboss=true) {
  ctx.font = "bold "+size+"px OCR-B, monospace";
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  if(emboss) {
    ctx.shadowOffsetX = -3;
    ctx.shadowOffsetY = -3;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(255,255,255,0.7)";
    ctx.fillText(text, x, y);
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.fillText(text, x, y);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
  } else {
    ctx.fillText(text, x, y);
  }
}

async function generate_declaration() {

  document.querySelector("#submit").innerText = "Generating (10%)";

  await load_lib("transliterate");

  if(document.querySelector("#generate_pdf417").checked) {
    await load_lib("pdf417");
  }

  document.querySelector("#submit").innerText = "Generating (20%)";

  var surname = document.querySelector("#surname").value.normalize("NFD").toUpperCase();
  var first_name = document.querySelector("#first_name").value.normalize("NFD").toUpperCase();
  var birth_date = document.querySelector("#birth_date").value;
  var issued = document.querySelector("#issued").value;
  var expiry = document.querySelector("#expiry").value;
  var id_number = document.querySelector("#id_number").value;
  var note = document.querySelector("#note").value.normalize("NFD").toUpperCase();
  var issuer = document.querySelector("#issuer").value.normalize("NFD").toUpperCase();
  var mrz = document.querySelector("#mrz").value = generate_mrz();
  var photo = document.querySelector("#photo").files[0];
  var signature = document.querySelector("#signature").files[0];

  document.querySelector("#submit").innerText = "Generating (30%)";

  if(document.querySelector("#generate_did").checked) {
    document.querySelector("#did").value = JSON.stringify(generate_did());
  }

  document.querySelector("#submit").innerText = "Generating (40%)";

  var template_front = await load_image("https://memdeklaro.github.io/memdeklaro/app/template_front.jpg");

  document.querySelector("#submit").innerText = "Generating (50%)";

  var template_back = await load_image("https://memdeklaro.github.io/memdeklaro/app/template_back.jpg");

  document.querySelector("#submit").innerText = "Generating (60%)";

  var add_photo = await load_image(URL.createObjectURL(photo));
  var add_signature = await load_image(URL.createObjectURL(signature));

  document.querySelector("#submit").innerText = "Generating (70%)";

  var font = new FontFace("OCR-B", 'url("https://memdeklaro.github.io/memdeklaro/app/OCR-B.ttf")');
  await font.load();
  document.fonts.add(font);
  await document.fonts.load("bold 80px OCR-B");

  document.querySelector("#submit").innerText = "Generating (80%)";

  var canvas_front = document.querySelector("#canvas_front");
  var ctx_front = canvas_front.getContext("2d");
  canvas_front.width = template_front.width;
  canvas_front.height = template_front.height;

  ctx_front.drawImage(template_front, 0, 0);

  add_text(ctx_front, surname, 65, 855, 325);
  add_text(ctx_front, first_name, 65, 855, 505);
  add_text(ctx_front, birth_date, 65, 855, 690);
  add_text(ctx_front, issued, 65, 855, 870);
  add_text(ctx_front, expiry, 65, 1415, 870);
  add_text(ctx_front, id_number, 65, 1415, 1050);
  
  var radius = 20;
  var x1 = 58;
  var x2 = 58 + 745;
  var y1 = 260;
  var y2 = 260 + 956;
  ctx_front.beginPath();
  ctx_front.moveTo((x1 + radius), y1);
  ctx_front.arcTo(x2, y1, x2, y2, radius);
  ctx_front.arcTo(x2, y2, x1, y2, radius);
  ctx_front.arcTo(x1, y2, x1, y1, radius);
  ctx_front.arcTo(x1, y1, x2, y1, radius);
  ctx_front.closePath();
  ctx_front.save();
  ctx_front.clip();
  ctx_front.drawImage(add_photo, 58, 260, 745, 956);
  ctx_front.restore();
  
  ctx_front.globalCompositeOperation = "multiply";
  ctx_front.drawImage(add_signature, 870, 1055, Math.round(add_signature.width * (150 / add_signature.height)), 150);
  ctx_front.globalCompositeOperation = "source-over";

  document.querySelector("#submit").innerText = "Generating (90%)";

  var canvas_back = document.querySelector("#canvas_back");
  var ctx_back = canvas_back.getContext("2d");
  canvas_back.width = template_back.width;
  canvas_back.height = template_back.height;
  
  ctx_back.drawImage(template_back, 0, 0);
  
  var note_lines = note.split("\n");
  for(var i = 0; i < note_lines.length; i++) {
    add_text(ctx_back, note_lines[i], 65, 55, 150 + (75 * i));
  }
  add_text(ctx_back, issuer, 65, 55, 410);
  
  document.querySelector("#submit").innerText = "Generating (90%)";

  if(!document.querySelector("#generate_pdf417").checked) {
    var mrz_lines = mrz.split("\n");
    for(var i = 0; i < mrz_lines.length; i++) {
      add_text(ctx_back, mrz_lines[i], 75, 180, 880 + (100 * i), false);
    }
  }

  if(document.querySelector("#generate_pdf417").checked) {
    var aamva = generate_aamva();
    var canvas_barcode = document.createElement("canvas");
    var barcode = PDF417.draw(aamva, canvas_barcode, 1, -1, 10, "rgb(0,0,0)");
    var barcode_image = canvas_barcode.toDataURL("image/png");
    var add_barcode = await load_image(barcode_image);
    ctx_back.drawImage(add_barcode, 155, 865, 1700, 300);
  }

  document.querySelector("#submit").innerText = "Generating (100%)";

  document.querySelector("#generator_front").style.display = "block";
  document.querySelector("#generator_back").style.display = "block"; 
  document.querySelector("#generator_pdf").style.display = "block"; 

  if(document.querySelector("#generate_did").checked) {
    document.querySelector("#generator_did").style.display = "block";
  }

  document.querySelector("#submit").innerText = "Generate New";
  document.querySelector("#download_front").innerText = "Download Front";
  document.querySelector("#download_back").innerText = "Download Back";
  document.querySelector("#download_pdf").innerText = "Download PDF";

  return true;

}

function download_front() {
  document.querySelector("#download_front").innerText = "Downloading...";
  var download_link = document.createElement("a");
  download_link.setAttribute("download", "memdeklaro_front.jpg");
  var canvas = document.querySelector("#canvas_front");
  canvas.toBlob(function(blob) {
    var url = URL.createObjectURL(blob);
    download_link.setAttribute("href", url);
    download_link.click();
    document.querySelector("#download_front").innerText = "Downloaded";
  }, "image/jpeg", 1);
}

function download_back() {
  document.querySelector("#download_back").innerText = "Downloading...";
  var download_link = document.createElement("a");
  download_link.setAttribute("download", "memdeklaro_back.jpg");
  var canvas = document.querySelector("#canvas_back");
  canvas.toBlob(function(blob) {
    var url = URL.createObjectURL(blob);
    download_link.setAttribute("href", url);
    download_link.click();
    document.querySelector("#download_back").innerText = "Downloaded";
  }, "image/jpeg", 1);
}

async function download_pdf() {

  document.querySelector("#download_pdf").innerText = "Generating (15%)";

  await load_lib("qrcode");
  await load_lib("jspdf");

  document.querySelector("#download_pdf").innerText = "Generating (30%)";

  var copy_front_data = document.querySelector("#canvas_front").toDataURL("image/jpeg");
  var copy_back_data = document.querySelector("#canvas_back").toDataURL("image/jpeg");

  var template_pdf = await load_image("https://memdeklaro.github.io/memdeklaro/app/template_pdf.jpg");
  var add_front = await load_image(copy_front_data);
  var add_back = await load_image(copy_back_data);

  document.querySelector("#download_pdf").innerText = "Generating (45%)";

  var canvas_pdf = document.createElement("canvas");
  var ctx_pdf = canvas_pdf.getContext("2d");
  canvas_pdf.width = template_pdf.width;
  canvas_pdf.height = template_pdf.height;
  
  ctx_pdf.drawImage(template_pdf, 0, 0);
 
  ctx_pdf.drawImage(add_front, 734, 620, 1012, 638);
  ctx_pdf.drawImage(add_back, 734, 1466, 1012, 638);

  document.querySelector("#download_pdf").innerText = "Generating (60%)";

  if(document.querySelector("#generate_did").checked) {
    var qr_data = JSON.stringify(generate_did());
  } else {
    var qr_data = JSON.stringify(generate_json_ld());
  }

  var qr_code = await QRCode.toDataURL(qr_data, { width: 800, height: 800 });
  var add_qr_code = await load_image(qr_code);
  ctx_pdf.drawImage(add_qr_code, 840, 2303, 800, 800);

  var copy_canvas = canvas_pdf.toDataURL("image/jpeg");

  document.querySelector("#download_pdf").innerText = "Generating (75%)";

  var doc = new jspdf.jsPDF();
  doc.addImage(copy_canvas, "JPEG", 0, 0, 210, 297);
  doc.save("memdeklaro.pdf");

  document.querySelector("#download_pdf").innerText = "Generating (100%)";

  document.querySelector("#download_pdf").innerText = "Downloaded";

  return true;

}