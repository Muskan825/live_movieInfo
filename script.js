//TMDB    API 

const api_key = 'api_key=4be64c6aa9d90c0a8a8a0bf6c661c8c1';
const base_url = 'https://api.themoviedb.org/3';
const api_url = base_url+'/discover/movie?sort_by=popularity.desc&'+api_key;
const img_url = 'https://image.tmdb.org/t/p/w500';
const search_url = base_url+'/search/movie?'+api_key;

const genres = [
     {"id":28,"name":"Action"}
    ,{"id":12,"name":"Adventure"}
    ,{"id":16,"name":"Animation"}
    ,{"id":35,"name":"Comedy"}
    ,{"id":80,"name":"Crime"}
    ,{"id":99,"name":"Documentary"}
    ,{"id":18,"name":"Drama"}
    ,{"id":10751,"name":"Family"}
    ,{"id":14,"name":"Fantasy"}
    ,{"id":36,"name":"History"}
    ,{"id":27,"name":"Horror"}
    ,{"id":10402,"name":"Music"}
    ,{"id":9648,"name":"Mystery"}
    ,{"id":10749,"name":"Romance"}
    ,{"id":878,"name":"Science Fiction"}
    ,{"id":10770,"name":"TV Movie"}
    ,{"id":53,"name":"Thriller"}
    ,{"id":10752,"name":"War"}
    ,{"id":37,"name":"Western"}
];

const main=document.getElementById("main");
const from = document.getElementById("form");
const search = document.getElementById("search");

var selectedGenres = [];

const tagE = document.getElementById("tags");
setGenres();
function setGenres(){
    tagE.innerHTML ='';
    genres.forEach(genre => {
        var t = document.createElement("div");
        t.classList.add("tag");
        t.id = genre.id;
        t.innerText =genre.name;
        t.addEventListener('click',()=>{
            if(selectedGenres.length==0){
                selectedGenres.push(genre.id);
            }
            else{
                if(selectedGenres.includes(genre.id)){
                    selectedGenres.forEach((id,idx) =>{
                        if(id==genre.id){
                            selectedGenres.splice(idx,1);
                        }
                    })
                }
                else{
                    selectedGenres.push(genre.id);
                }
            }
            // console.log(selectedGenres);
            getMovies(api_url+'&with_genres='+encodeURI(selectedGenres.join(',')));
            highlight();
        })
        tagE.append(t);
    })
}


function highlight(){
    const tags =document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove("change");
    })
    clrbtn();
    if(selectedGenres.length!=0){
        selectedGenres.forEach(id =>{
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add("change");
        })
    }
}


function getMovies(url){
    fetch(url).then(res => res.json())
    .then(data => {
        // console.log(data.results);
        if(data.results.length!=0){
            showMovies(data.results);
        }
        else{
            main.innerHTML = `<h1 class="noR">NO RESULTS FOUND</h1>`;
        }
    })
}

function clrbtn(){
    var clearbtn  = document.getElementById("clear");
    if(clearbtn){
        clearbtn.classList.add("change");
        if(selectedGenres.length==0){
            clearbtn.classList.add("del");
        }
    }
    else{
        {
            let btn = document.createElement("button");
            btn.classList.add("tag", "change");
            btn.id = "clear";
            btn.innerText = "Clear  X";
            btn.addEventListener("click",() =>{
                selectedGenres=[];
                setGenres();
                getMovies(api_url);
            })
            tagE.append(btn);
        }
    }
}

getMovies(api_url);

function showMovies(data){
    main.innerHTML='';
    data.forEach(movie => {
        const{title,poster_path,vote_average,overview}=movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML = `<img src="${poster_path?img_url+poster_path:"https://tse2.mm.bing.net/th?id=OIP.ruRl-rvJ3byJk5mKVVdzKgHaEo&pid=Api&P=0&w=320&h=200"}" alt="${title}">
        <div class="movieinfo">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview};
        </div>`;

        main.appendChild(movieE1);
    });
}

function getColor(vote){
    if(vote>=8){
        return "green";
    }
    else if(vote>=5){
        return "orange";
    }
    else{
        return "red";
    }
}


from.addEventListener("submit",(e)=>{
    e.preventDefault();
    const searchM = search.value;
    selectedGenres = [];
    setGenres();
    if(searchM){
        getMovies(search_url+'&query='+searchM);
    }
    else{
        getMovies(api_url);
    }
})