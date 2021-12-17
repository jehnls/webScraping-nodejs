const axios =  require("axios");
const cheerio = require("cheerio");


const organization = "microsoft"
const url = `https://github.com/${organization}`
axios(url).then((response)=> {
const html = response.data;

        //PINNEDREPOSITORIES
const pinned = repositoriesPinnedToParse(response.data);



}).catch(console.error());


 let test = verifyQuantityPagesOrganizationRepositores("microsoft");

 test.then((res)=>{
   console.log("qtda", res)
 })
  


async function  verifyQuantityPagesOrganizationRepositores(nameOrganization) { //arrumar
  let quantityRepositoriesPages = ""
  const urlRepositoriesByPage = `https://github.com/orgs/${nameOrganization}/repositories?page=1`
   axios(urlRepositoriesByPage).then((response)=>{
    const $ = cheerio.load(response.data);
    
    quantityRepositoriesPages = $("em.current").attr("data-total-pages")
    
    console.log(quantityRepositoriesPages)

  }).catch((err)=>{
  console.error(err)
  })

  return quantityRepositoriesPages;
}

 function repositoresToParse(pageHtml) {
  const $ =  cheerio.load(pageHtml);
    //Repositories
  const repositories = [];
  const repositoriesToParse = $("li.Box-row");

  repositoriesToParse.each((i, element)=>{
  const repository = $(element).find("a.d-inline-block").text().trim()
  const status = $(element).find("div.public.source.archived.d-block.py-0.border-none").text() === "" ? "" : "archived" //TODO Verificar se esta preenchendo, quando estiver um repositorio archived 
  const url= HOSTGITHUB + $(element).find("a.d-inline-block").attr("href");
  const description = $(element).find("p.color-fg-muted.mb-0.wb-break-word").text().trim()

  const tags =  []
  const tagsToParse = $(element).find("div.d-inline-flex.flex-wrap.flex-items-center.f6.my-1");
  tagsToParse.each((i, element)=>{
  const tag = $(element).find("a").text().trim();
    tags.push(tag.replace(/(\n)/gm, ""));
  })

  const language = $(element).find("div:nth-child(1) > div:nth-child(2) > span:nth-child(1) > span:nth-child(2)").text().trim()

  const linkAncora = $(element).find("div:nth-child(1) > div.color-fg-muted.f6.mt-2 > a");
  const forks = $(linkAncora[0]).text().trim()
  const stars = $(linkAncora[1]).text().trim()
  const issues =$(linkAncora[2]).text().trim()
  const pullRequests = $(linkAncora[4]).text().trim() === "" ? $(linkAncora[3]).text().trim() : $(linkAncora[4]).text().trim() 


  const lastUpdate = $(element).find("div:nth-child(1) > div:nth-child(2) > span.no-wrap > relative-time:nth-child(1)").attr("datetime")
  
  repositories.push({
    repository,
      status,
      url,
      description,
      tags,
      language,
      forks,
      stars,
      issues,
      pullRequests,
      lastUpdate,
  })
  });

  return repositories

}

function repositoriesPinnedToParse(pageHtml) {
  const $ = cheerio.load(pageHtml);

const pinned = [];
const repositoriesPinnedToParse = $("li.mb-3");

repositoriesPinnedToParse.each((i, element)=>{
  const  repository = $(element).find("span.repo").text();
  const  url = "https://github.com" + $(element).find("a").attr("href");
  const  description = $(element).find("p.pinned-item-desc.color-fg-muted.text-small.d-block.mt-2.mb-3").text().trim(); 
  const  language  =  $(element).find("span > span:nth-child(2)").text().trim();
  const  stars = $(element).find("p.mb-0.f6.color-fg-muted > a:nth-child(2)").text().trim();
  const  forks = $(element).find("p.mb-0.f6.color-fg-muted > a:nth-child(3)").text().trim()

  pinned.push({
    repository,
    url,
    description,
    language,
    stars,
    forks
  })
})

return pinned;
}

function topUsersToParse (pageHtml) {
  const $ = cheerio.load(pageHtml)

  const topUsers = [];
  const topUsersToParse = $("a.member-avatar");
  topUsersToParse.each((i, element)=> {
   const TopUser = $(element).find("img.avatar").attr("alt");
    topUsers.push(TopUser.replace("@", ""));
  })

  return topUsers

}

function topTagsToParse(pageHtml) {
  const $ = cheerio.load(pageHtml)

  const topTags = [];

  const topTagsToParse =  $("a.topic-tag");
  topTagsToParse.each((i, element)=>{
    const topTag = $(element).text().trim();
   topTags.push(topTag);
  }); 

  return topTags;
}

function topLanguagesToParse(pageHtml) {
  const $  = cheerio.load (pageHtml);

  const topLanguages =[];
  const topLanguagesToParse = $("a.color-fg-muted")

  topLanguagesToParse.each((i, element)=> {
    const topLanguage = $(element).find("span:nth-child(1)").text().trim();
    topLanguages.push(
    topLanguage
    )
  });

  return topLanguages;
}

function urlsToParse(pageHtml) {
  const $ = cheerio.load(pageHtml)

  const urls =[];
  const urlsToParse = $("li.mr-md-3");

  urlsToParse.each((i, element)=>{
    const url = $(element).find('a').attr("href");
    const description = $(element).find('a').text()
    urls.push({
     url,
     description
    })
  })

  return urls;
}

// function headersToParse (pageHtml) {
//   const $ = cheerio.load(pageHtml);

//   return headers = {
//     title = $(".h2").text().trim(),
//     avatar = $("img.flex-shrink-0:nth-child(1)").attr("src"),
//     urls =urlsToParse(pageHtml),
//     topLanguages = topLanguagesToParse(pageHtml),
//     topTags = topTagsToParse(pageHtml),
//     topUsers = topUsersToParse(pageHtml)
//   };

// }