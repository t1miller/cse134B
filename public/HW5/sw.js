var CACHE_NAME = 'over-dex-cache-v4';
var urlsToCache = [
  '/HW5/HeroPortraits/AnaPortrait.png',
  '/HW5/HeroPortraits/BastionPortrait.png',
  '/HW5/HeroPortraits/DVaPortrait.png',
  '/HW5/HeroPortraits/GenjiPortrait.png',
  '/HW5/HeroPortraits/HanzoPortrait.png',
  '/HW5/HeroPortraits/JunkratPortrait.png',
  '/HW5/HeroPortraits/LucioPortrait.png',
  '/HW5/HeroPortraits/McCreePortrait.png',
  '/HW5/HeroPortraits/MeiPortrait.png',  
  '/HW5/HeroPortraits/MercyPortrait.png',  
  '/HW5/HeroPortraits/PharahPortrait.png',  
  '/HW5/HeroPortraits/ReaperPortrait.png',  
  '/HW5/HeroPortraits/ReinhardtPortrait.png',  
  '/HW5/HeroPortraits/RoadhogPortrait.png',  
  '/HW5/HeroPortraits/SoldierPortrait.png',  
  '/HW5/HeroPortraits/SymmetraPortrait.png',  
  '/HW5/HeroPortraits/TorbjornPortrait.png',  
  '/HW5/HeroPortraits/TracerPortrait.png',  
  '/HW5/HeroPortraits/WidowmakerPortrait.png',  
  '/HW5/HeroPortraits/WinstonPortrait.png',  
  '/HW5/HeroPortraits/ZaryaPortrait.png',  
  '/HW5/HeroPortraits/ZenyattaPortrait.png',  
  '/HW5/MinJS/controller.js',
  '/HW5/MinJS/dboperations.js',
  '/HW5/login.html',
  '/HW5/Overwatch-Banner.png',
  //'/HW5/style/heropicker.css',
  //'/HW5/style/login.css',
  //'/HW5/style/styles.css',
  '/HW5/style/bignoodletoo.ttf',  
  //'/HW5/sw.js',  
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});