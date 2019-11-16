var Palavras = [];
var IteracaoDosEstados = [0];
var EstadoGlobal = 0;
var Estados = [[]];
var Tabela 	= [];

$(document).ready(function(){
	$('#insere_palavras').click(() => {
		var palavra = ($('#input_palavras').val()).toLowerCase();
		if(palavra){
			addPalavras(palavra);
		}

		montaEstadoPalavra();
		Tabela = geraLinhasTabela();
		montaTabela(Tabela);
	});

	$('#buscar_palavras').keyup(() => {
		if(Tabela.length > 0){
			validaPalavra();
		}
	});

	$('#input_palavras').keyup(() => {
		var palavra = ($('#input_palavras').val()).toLowerCase();
		var exprRegular = /([^A-Za-z_])/;
		if(exprRegular.test(palavra)){
			$('#insere_palavras').addClass('disabled');
			$('#input_palavras').val(palavra.replace(palavra.slice(-1), ''));
		} else {
			$('#insere_palavras').removeClass('disabled');
		}
	});

});

const addPalavras = palavra => {
	if (Palavras.indexOf(palavra) < 0 && palavra.length > 0) {
		$('#input-field').append(`<span class='addedWord'>${palavra}
								<i onclick=\"rmvPalavras('${palavra}')\" class='fas fa-trash'></i> </span><br>`);
		Palavras.push(palavra);
		$('#input_palavras').val('');
	} 
};

const rmvPalavras = palavra => {
	var index = Palavras.indexOf(palavra);
	if (index >= 0 && palavra.length > 0) {
		Palavras.splice(index, 1);
		$(".addedWord").each(function() {
		    if ($(this).text().trim() == palavra.trim()) {
			  $(this).hide();
		    }
		});
	}
	limpaRefazAnalisador();
};

function limpaRefazAnalisador() {
	$('#tabela_tbody').html('');
	IteracaoDosEstados = [0];
	EstadoGlobal = 0;
	Estados = [[]];
	Tabela 	= [];
	montaEstadoPalavra();
	Tabela = geraLinhasTabela();
	montaTabela(Tabela);
};

const montaEstadoPalavra = () => {
	for(var i=0; i<Palavras.length; i++) {
		var estadoAtual = 0;
		var palavrasArray = Palavras[i];
		for(var j=0; j<palavrasArray.length; j++){
			if(typeof Estados[estadoAtual][palavrasArray[j]] === 'undefined'){
				var proximoEstado = EstadoGlobal + 1;
				Estados[estadoAtual][palavrasArray[j]] = proximoEstado;
				Estados[proximoEstado] = [];
				EstadoGlobal = estadoAtual = proximoEstado;
			} else {
				estadoAtual = Estados[estadoAtual][palavrasArray[j]];
			}

			if(j == palavrasArray.length - 1){
				Estados[estadoAtual]['final'] = true;
			}
		}
	}
};

const geraLinhasTabela = () => {
	var estadosArray = [];
	for(var i=0; i<Estados.length; i++) {
		var aux = [];
		aux['estado'] = i;
		var primChar = 'a';
		var ultiChar = 'z';
		for(var j=primChar.charCodeAt(0); j<=ultiChar.charCodeAt(0); j++) {
			var varra = String.fromCharCode(j);
			if(typeof Estados[i][varra] === 'undefined'){
				aux[varra] = '-';
			} else {
				aux[varra] = Estados[i][varra];
			}
		}
		if(typeof Estados[i]['final'] !== 'undefined'){
			aux['final'] = true;
		}
		estadosArray.push(aux);
	};
	return estadosArray;
};

