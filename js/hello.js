$(function(){

dataHello = [{
        "language": "english",
        "hello": "hello"
      },
      {
        "language": "afrikaans",
        "hello": "hallo"
      },
      {
        "language": "albanian",
        "hello": "përshëndetje"
      },
      {
        "language": "amharic",
        "hello": "ሰላም"
      },
      {
        "language": "arabic",
        "hello": "مرحبا"
      },
      {
        "language": "armenian",
        "hello": "բարեւ"
      },
      {
        "language": "azerbaijani",
        "hello": "salam"
      },
      {
        "language": "basque",
        "hello": "kaixo"
      },
      {
        "language": "bengali",
        "hello": "হ্যালো"
      },
      {
        "language": "bosnian",
        "hello": "zdravo"
      },
      {
        "language": "bulgarian",
        "hello": "здравейте"
      },
      {
        "language": "catalan",
        "hello": "hola"
      },
      {
        "language": "cebuano",
        "hello": "hello"
      },
      {
        "language": "chichewa",
        "hello": "moni"
      },
      {
        "language": "chinese",
        "hello": "您好"
      },
      {
        "language": "corsican",
        "hello": "bonghjornu"
      },
      {
        "language": "croatian",
        "hello": "zdravo"
      },
      {
        "language": "czech",
        "hello": "ahoj"
      },
      {
        "language": "danish",
        "hello": "hej"
      },
      {
        "language": "dutch",
        "hello": "hallo"
      },
      {
        "language": "english",
        "hello": "hello"
      },
      {
        "language": "esperanto",
        "hello": "saluton"
      },
      {
        "language": "estonian",
        "hello": "tere"
      },
      {
        "language": "filipino",
        "hello": "hello"
      },
      {
        "language": "finnish",
        "hello": "hei"
      },
      {
        "language": "french",
        "hello": "bonjour"
      },
      {
        "language": "frisian",
        "hello": "hello"
      },
      {
        "language": "galician",
        "hello": "ola"
      },
      {
        "language": "georgian",
        "hello": "გამარჯობა"
      },
      {
        "language": "german",
        "hello": "hallo"
      },
      {
        "language": "greek",
        "hello": "γεια σας"
      },
      {
        "language": "gujarati",
        "hello": "હેલો"
      },
      {
        "language": "haitian creole",
        "hello": "bonjou"
      },
      {
        "language": "hausa",
        "hello": "sannu"
      },
      {
        "language": "hawaiian",
        "hello": "alohaʻoe"
      },
      {
        "language": "hebrew",
        "hello": "שלום"
      },
      {
        "language": "hindi",
        "hello": "नमस्ते"
      },
      {
        "language": "hmong",
        "hello": "nyob zoo"
      },
      {
        "language": "hungarian",
        "hello": "helló"
      },
      {
        "language": "icelandic",
        "hello": "halló"
      },
      {
        "language": "igbo",
        "hello": "ndewo"
      },
      {
        "language": "indonesian",
        "hello": "halo"
      },
      {
        "language": "irish",
        "hello": "dia duit"
      },
      {
        "language": "italian",
        "hello": "ciao"
      },
      {
        "language": "japanese",
        "hello": "こんにちは"
      },
      {
        "language": "javanese",
        "hello": "hello"
      },
      {
        "language": "kannada",
        "hello": "ಹಲೋ"
      },
      {
        "language": "kazakh",
        "hello": "сәлем"
      },
      {
        "language": "khmer",
        "hello": "ជំរាបសួរ"
      },
      {
        "language": "korean",
        "hello": "안녕하세요."
      },
      {
        "language": "kurdish (kurmanji)",
        "hello": "hello"
      },
      {
        "language": "kyrgyz",
        "hello": "салам"
      },
      {
        "language": "lao",
        "hello": "ສະບາຍດີ"
      },
      {
        "language": "latin",
        "hello": "salve"
      },
      {
        "language": "latvian",
        "hello": "labdien"
      },
      {
        "language": "lithuanian",
        "hello": "sveiki"
      },
      {
        "language": "luxembourgish",
        "hello": "moien"
      },
      {
        "language": "macedonian",
        "hello": "здраво"
      },
      {
        "language": "malagasy",
        "hello": "hello"
      },
      {
        "language": "malay",
        "hello": "hello"
      },
      {
        "language": "malayalam",
        "hello": "ഹലോ"
      },
      {
        "language": "maltese",
        "hello": "hello"
      },
      {
        "language": "maori",
        "hello": "hiha"
      },
      {
        "language": "marathi",
        "hello": "हॅलो"
      },
      {
        "language": "myanmar (burmese)",
        "hello": "မင်္ဂလာပါ"
      },
      {
        "language": "nepali",
        "hello": "नमस्ते"
      },
      {
        "language": "norwegian",
        "hello": "hallo"
      },
      {
        "language": "pashto",
        "hello": "سلام"
      },
      {
        "language": "persian",
        "hello": "سلام"
      },
      {
        "language": "polish",
        "hello": "cześć"
      },
      {
        "language": "portuguese",
        "hello": "olá"
      },
      {
        "language": "punjabi",
        "hello": "ਹੈਲੋ"
      },
      {
        "language": "romanian",
        "hello": "alo"
      },
      {
        "language": "russian",
        "hello": "привет"
      },
      {
        "language": "samoan",
        "hello": "talofa"
      },
      {
        "language": "scots gaelic",
        "hello": "hello"
      },
    
      {
        "language": "sesotho",
        "hello": "hello"
      },
      {
        "language": "shona",
        "hello": "hello"
      },
      {
        "language": "sindhi",
        "hello": "هيلو"
      },
      {
        "language": "sinhala",
        "hello": "හෙලෝ"
      },
      {
        "language": "slovak",
        "hello": "ahoj"
      },
      {
        "language": "slovenian",
        "hello": "pozdravljeni"
      },
      {
        "language": "somali",
        "hello": "hello"
      },
      {
        "language": "spanish",
        "hello": "hola"
      },
      {
        "language": "sundanese",
        "hello": "halo"
      },
      {
        "language": "swahili",
        "hello": "sawa"
      },
      {
        "language": "swedish",
        "hello": "hallå"
      },
      {
        "language": "tajik",
        "hello": "салом"
      },
      {
        "language": "tamil",
        "hello": "ஹலோ"
      },
      {
        "language": "telugu",
        "hello": "హలో"
      },
      {
        "language": "thai",
        "hello": "สวัสดี"
      },
      {
        "language": "turkish",
        "hello": "merhaba"
      },
      {
        "language": "ukranian",
        "hello": "здрастуйте"
      },
      {
        "language": "urdu",
        "hello": "ہیلو"
      },
      {
        "language": "uzbek",
        "hello": "salom"
      },
      {
        "language": "vietnamese",
        "hello": "xin chào"
      },
      {
        "language": "welsh",
        "hello": "helo"
      },
      {
        "language": "xhosa",
        "hello": "sawubona"
      },
      {
        "language": "yiddish",
        "hello": "העלא"
      },
      {
        "language": "yoruba",
        "hello": "kaabo"
      },
      {
        "language": "zulu",
        "hello": "sawubona"
      }
];
    
    setInterval(function(){
    var dataNumber = Math.floor(Math.random() * (Math.floor(Math.random() * 100)));
	var hello = dataHello[dataNumber].hello;
    var language = dataHello[dataNumber].language;
	$('#hello').text(hello);
    $('#language').text('(' + language + ')');
	}, 2000);

});