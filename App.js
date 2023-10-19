
const API_KEY='f531333d637d0c44abc85b3e74db2186';
const API=`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`;
const IMAGE_URL=`https://image.tmdb.org/t/p/original`;


const movieListingTag=document.querySelector('.movieListing');
const prevBtnTag=document.querySelector('.prevBtn');
const nextBtnTag=document.querySelector('.nextBtn');
const sortByDateBtnTag=document.querySelector('.sortByDate');
const sortByRatingBtnTag=document.querySelector('.sortByRating');
let currentMovieData='';
let sortByDateMovieData='';
let sortByRatingMovieData='';
let issortByDate=false;
let issortByRating=false;

let currentPage=1;

prevBtnTag.addEventListener('click',()=>{
    if(currentPage===1){
        return;
    }
    currentPage--;
    getPaginatedMovieData(currentPage);
})
nextBtnTag.addEventListener('click',()=>{
    if(currentPage===3){
        return;
    }
    currentPage++;
    getPaginatedMovieData(currentPage);
})
sortByDateBtnTag.addEventListener('click',()=>{
    if(issortByDate){
        issortByDate=false;
        issortByRating=false;
        updateMoviePage(currentMovieData);
        return;
    }
    issortByDate=true;
    issortByRating=false;
    if(!sortByDateMovieData){
       sortByDateMovieData= sortMovie([...currentMovieData],'date')
    }
    updateMoviePage(sortByDateMovieData);
})
sortByRatingBtnTag.addEventListener('click',()=>{
    if(issortByRating){
        issortByRating=false;
        issortByDate=false;
        updateMoviePage(currentMovieData);
        return;
    }
    issortByRating=true;
    issortByDate=false;
    if(!sortByRatingMovieData){
        sortByRatingMovieData=sortMovie([...currentMovieData],'rating')
    }
    updateMoviePage(sortByRatingMovieData);
})


function updateMoviePage(movieArray){
    // const updatedMovieListing=document.createDocumentFragment();
    let updatedMovieListing='';

    for(let { title, vote_count,vote_average,poster_path,isFavourite,id} of movieArray){
        // const movieFragment=document.createElement('div');
     
     const movieUrl=`${IMAGE_URL}/${poster_path}`;
    const movieCard=`<div class="movieCard">
                       <img src="${movieUrl}"alt="">
                      <div>
                       <div class="movieDetails">
                         <h5>${title}</h5>
                         <div>
                      <span>Votes: ${vote_count}</span>
                        <span>Rating: ${vote_average}</span>
                       </div>

                          </div>
                          <i 
                          class="fa-heart ${isFavourite?'fa-solid':'fa-regular'}"
                          id="${id}"
                          data-is-Favourite="${isFavourite}"
                          >
                          
                          </i>
                    </div>
                   </div>`
    //    movieFragment.innerHTML=movieCard;
    updatedMovieListing+=movieCard;
    }
    console.log(updatedMovieListing);
//   movieListingTag.append(updatedMovieListing);
movieListingTag.innerHTML=updatedMovieListing;
const favIFrameTags=document.querySelectorAll('.fa-heart');
for(let favIcon of favIFrameTags){
 favIcon.addEventListener('click',handleFavourite)
}
}
function handleFavourite(e){
    let isRemove=false;
    if(e.target.dataset.isFavourite=='true'){
    e.target.classList.remove('fa-solid');
    e.target.classList.add('fa-regular');
    e.target.dataset.isFavourite=false;
    isRemove=true;

}
else{
    e.target.classList.remove('fa-regular');
    e.target.classList.add('fa-solid');
    e.target.dataset.isFavourite=true;
}


   

    const filteredArr=currentMovieData.filter((val,index) => {
       return val.id==e.target.id
    })
    
    const localMovieStorage=JSON.parse(localStorage.getItem('favouriteMovieList'));
if(!isRemove){
    let newfavObj;

    if(localMovieStorage){
       newfavObj={
            [filteredArr[0].id]:filteredArr[0],
            ...localMovieStorage
       }
    }
    else{
        newfavObj={
            [filteredArr[0].id]:filteredArr[0],
        
       }
    }
    localStorage.setItem('faviouriteMovieList',JSON.stringify(newfavObj));
        
}
else{
    if(localMovieStorage){
        delete localMovieStorage[filteredArr[0]]
    }
    localStorage.setItem('faviouriteMovieList',JSON.stringify(localMovieStorage));
}

    
    }

async  function getPaginatedMovieData(page=1){
    restPageValues()
 movieListingTag.innerHTML="loading";
 const response=await fetch(`${API}&page=${page}`);
 const movieData=await response.json();
 currentMovieData=movieData.results;
 updateMoviePage(movieData.results.slice());
 
}
function restPageValues(){
    sortByDateMovieData="";
    sortByRatingMovieData="";
    issortByDate=false;
    issortByRating=false; 
}
function sortMovie(movieArr,sortBy){
    console.log(movieArr);
    let sortingKey='';
 if(sortBy==='date'){
   sortingKey='release_date';
   movieArr.sort((movieObjA,movieObjB)=>{
    movieObjA.epochTime=new Date(movieObjA[sortingKey]);
    movieObjB.epochTime=new Date(movieObjB[sortingKey]);
    return movieObjA.epochTime-movieObjB.epochTime
   })
   return movieArr;
 }


 else if(sortBy==='rating'){
   sortingKey='vote_average';
 }
 console.log(sortingKey);
 console.log(movieArr[0]);
 console.log(movieArr[0][sortingKey]);
 movieArr.sort((movieObjA,movieObjB)=>{
    return movieObjA[sortingKey]-movieObjB[sortingKey]
 })
 return movieArr;
 }

getPaginatedMovieData(currentPage);

// const sampleExec=document.querySelector('.sampleExec');

// const random=`<div class="movieCard">
//               <img src="${10+20}"alt="">
//                 <div>
//                    <div class="movieDetails">
//                  <h5>${100}</h5>
//                 <div>
//                 <span>Votes: ${88}</span>
//                  <span>Rating: ${0}</span>
//               </div>
//                 </div>
//                 <span>ICON</span>
//              </div>
//                </div>`

// sampleExec.innerHTML=random;


// const sampleExec=document.querySelector('.sampleExec');
// let htmlFrag=document.createDocumentFragment();
// const arr=[10,20,30,40]
// for(let i of arr){
//     htmlFrag.append(i);
// }
// sampleExec.append(htmlFrag);





























// const url = 'https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '434aaa5e83msh587332b54c8a171p175a9ejsnf410d43b1488',
// 		'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
// 	}
// };

// async function getData(){

// try {
// 	const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);
// } catch (error) {
// 	console.error(error);
// }

// }

// getData();