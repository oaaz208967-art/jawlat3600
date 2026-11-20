/* ================= DATA LAYER (configuration, not code branches) =================
   Cities, categories (with their own fields / sorts / price bands / booking mode)
   and places are plain records. Adding a city or a category = adding a record. */
const REGIONS=[
 {id:'eastern',ar:'المنطقة الشرقية',en:'Eastern Province'},
 {id:'riyadh',ar:'منطقة الرياض',en:'Riyadh Region'},
 {id:'makkah',ar:'منطقة مكة المكرمة',en:'Makkah Region'},
 {id:'madinah',ar:'منطقة المدينة المنورة',en:'Madinah Region'},
 {id:'asir',ar:'منطقة عسير',en:'Asir Region'},
 {id:'tabuk',ar:'منطقة تبوك',en:'Tabuk Region'},
 {id:'jazan',ar:'منطقة جازان',en:'Jazan Region'},
 {id:'baha',ar:'منطقة الباحة',en:'Al Baha Region'},
 {id:'hail',ar:'منطقة حائل',en:'Hail Region'},
 {id:'qassim',ar:'منطقة القصيم',en:'Qassim Region'}
];
const CITIES=[
 {slug:'dammam',code:'dmm',ar:'الدمام',en:'Dammam',region:'eastern',lat:26.43,lng:50.10,active:true,scene:['sea',3],
  about:'مدينة ساحلية على الخليج العربي وعاصمة المنطقة الشرقية. تجمع بين الواجهة البحرية والأحياء السكنية والمرافق الخدمية.',
  districts:['الشاطئ','الفيصلية','الفيحاء']},
 {slug:'khobar',code:'khb',ar:'الخبر',en:'Al Khobar',region:'eastern',lat:26.28,lng:50.21,active:true,scene:['sea',1],
  about:'مدينة ساحلية في المنطقة الشرقية، معروفة بكورنيشها ومقاهيها ومجمعاتها التجارية وأماكن الجلوس على البحر.',
  districts:['العقربية','الراكة','الثقبة']},
 {slug:'dhahran',code:'dhr',ar:'الظهران',en:'Dhahran',region:'eastern',lat:26.29,lng:50.11,active:true,scene:['garden',0],
  about:'مدينة في المنطقة الشرقية تضم جامعات ومؤسسات بحثية وأحياء هادئة قريبة من الخبر والدمام.',
  districts:['الجامعة','الدوحة الجنوبية']},
 {slug:'riyadh',code:'ruh',ar:'الرياض',en:'Riyadh',region:'riyadh',lat:24.71,lng:46.68,active:true,scene:['city',2],
  about:'عاصمة المملكة ومركز الأعمال والخدمات، بمدينة واسعة تتنوع فيها المنشآت والتجارب والوجهات.',
  districts:['الملقا','العليا','حطين']},
 {slug:'jeddah',code:'jed',ar:'جدة',en:'Jeddah',region:'makkah',lat:21.54,lng:39.17,active:true,scene:['sea',0],
  about:'مدينة ساحلية على البحر الأحمر ووجهة رئيسية للسياحة والتجارة، بواجهة بحرية وأحياء تاريخية وحديثة.',
  districts:['الحمراء','أبحر الشمالية','الروضة']},
 {slug:'makkah',ar:'مكة المكرمة',en:'Makkah',region:'makkah',active:false},
 {slug:'madinah',ar:'المدينة المنورة',en:'Madinah',region:'madinah',active:false},
 {slug:'taif',ar:'الطائف',en:'Taif',region:'makkah',active:false},
 {slug:'abha',ar:'أبها',en:'Abha',region:'asir',active:false},
 {slug:'alula',ar:'العلا',en:'AlUla',region:'madinah',active:false},
 {slug:'yanbu',ar:'ينبع',en:'Yanbu',region:'madinah',active:false},
 {slug:'tabuk',ar:'تبوك',en:'Tabuk',region:'tabuk',active:false},
 {slug:'jazan',ar:'جازان',en:'Jazan',region:'jazan',active:false},
 {slug:'baha',ar:'الباحة',en:'Al Baha',region:'baha',active:false},
 {slug:'hail',ar:'حائل',en:'Hail',region:'hail',active:false},
 {slug:'qassim',ar:'القصيم',en:'Qassim',region:'qassim',active:false}
];

const SORT_LABELS={new:'الأحدث',priceAsc:'من الأرخص إلى الأغلى',priceDesc:'من الأغلى إلى الأرخص',mostBooked:'الأكثر حجزًا',rating:'الأعلى تقييمًا',capacity:'الأكبر سعة',views:'الأكثر مشاهدة'};
const BASIC_SORTS=['new','rating','views'];
const PRICED_SORTS=['new','priceAsc','priceDesc','mostBooked','rating','views'];

/* C(slug, abbr, nameAr, nameEn, icon, bookingMode, scene, extras) */
const C=(slug,ab,ar,en,icon,mode,scene,o={})=>({slug,ab,ar,en,icon,mode,scene,requires360:false,requiresVerification:true,fields:[],amen:[],sorts:BASIC_SORTS,priceBands:null,...o});
const F=(k,l,t,u)=>({k,l,t,u});
const CATS=[
 C('chalets','ch','الشاليهات والاستراحات','Chalets & Retreats','home','booking','pool',{requires360:true,home:1,
   sorts:['new','priceAsc','priceDesc','mostBooked','rating','capacity','views'],priceBands:[600,1000,1500],
   desc:'شاليهات واستراحات بجولات 360° ومعلومات واضحة عن السعة والمرافق والأسعار قبل أن تقرر.',
   fields:[F('guests','عدد الأشخاص','num','شخص'),F('rooms','عدد الغرف','num'),F('baths','دورات المياه','num'),F('pool','المسبح','bool'),F('kitchen','المطبخ','bool'),F('seating','الجلسات','text'),F('games','الألعاب','text'),F('parking','المواقف','num','سيارة'),F('privacy','الخصوصية (يضيفها المالك)','text'),F('weekday','السعر أيام الأسبوع','price','لليلة'),F('weekend','سعر الويكند','price','لليلة')],
   amen:['واي فاي','تكييف مركزي','منطقة شواء','ملعب أطفال','جلسات مظللة','مطبخ مجهز','إطلالة خارجية','تلفاز وألعاب']}),
 C('hotels','ht','الفنادق','Hotels','bed','booking','city',{home:1,sorts:PRICED_SORTS,priceBands:[400,700,1100],
   desc:'فنادق وشقق فندقية تستعرض غرفها ومرافقها بجولة 360° قبل الإقامة.',
   fields:[F('rooms','عدد الغرف','num','غرفة'),F('roomTypes','أنواع الغرف','text'),F('pool','المسبح','bool'),F('gym','النادي','bool'),F('spa','السبا','bool'),F('restaurants','المطاعم داخل الفندق','num'),F('parking','المواقف','bool')],
   amen:['استقبال على مدار الساعة','مطعم','مواقف','قاعة اجتماعات','نادٍ رياضي','خدمة الغرف']}),
 C('resorts','rs','المنتجعات','Resorts','palm','booking','sea',{home:1,sorts:PRICED_SORTS,priceBands:[700,1200,2000],
   desc:'منتجعات ووجهات إقامة مفتوحة بمساحات خارجية وخدمات متنوعة.',
   fields:[F('rooms','عدد الوحدات','num','وحدة'),F('pool','المسبح','bool'),F('beach','الواجهة البحرية','bool'),F('kids','نادي الأطفال','bool')],
   amen:['مسبح','شاطئ','مطعم','ملاعب','نشاطات عائلية']}),
 C('real-estate','re','العقارات','Real Estate','building','request-visit','city',{home:1,sorts:PRICED_SORTS,priceBands:[600000,1000000,2000000],
   desc:'مشاريع عقارية ووحدات سكنية وتجارية تُشاهد بجولة 360° قبل طلب الزيارة.',
   fields:[F('kind','نوع المشروع','text'),F('units','عدد الوحدات','num','وحدة'),F('area','المساحات','text'),F('state','حالة المشروع','text')],
   amen:['مواقف','أمن وحراسة','حديقة','نادٍ رياضي','مصاعد']}),
 C('restaurants','rt','المطاعم','Restaurants','fork','reservation','interior',{home:1,
   desc:'مطاعم بجلساتها وقوائمها ومساحاتها، تُرى بجولة 360° قبل الوصول.',
   fields:[F('cuisine','نوع الطعام','text'),F('families','قسم العوائل (يضيفه صاحب المنشأة)','bool'),F('singles','قسم الأفراد (يضيفه صاحب المنشأة)','bool'),F('outdoor','جلسات خارجية','bool'),F('privateRoom','جلسات خاصة','bool')],
   amen:['مواقف','واي فاي','جلسات خارجية','توصيل','طلب مسبق']}),
 C('cafes','cf','المقاهي','Cafes','cup','none','interior',{home:1,
   desc:'مقاهٍ وكافيهات بأجوائها وجلساتها وإطلالاتها.',
   fields:[F('speciality','التخصص','text'),F('outdoor','جلسات خارجية','bool'),F('families','قسم العوائل (يضيفه صاحب المنشأة)','bool'),F('wifi','واي فاي','bool')],
   amen:['قهوة مختصة','واي فاي','جلسات خارجية','مواقف','حلويات']}),
 C('tourist-attractions','ta','الأماكن السياحية','Tourist Attractions','compass','inquiry','sea',{home:1,
   desc:'أماكن سياحية ومعالم تستحق الزيارة، بساعات الزيارة والتجهيزات.',
   fields:[F('duration','مدة الزيارة','text'),F('age','العمر المناسب','text'),F('ticket','سعر الدخول','price')],
   amen:['مواقف','مصليات','دورات مياه','مقاهٍ قريبة']}),
 C('activities','ac','الأنشطة والتجارب','Activities & Experiences','ticket','booking','garden',{home:1,sorts:PRICED_SORTS,priceBands:[100,250,500],
   desc:'أنشطة وتجارب بمدة وسعر وفئة عمرية معروفة قبل الذهاب.',
   fields:[F('duration','مدة التجربة','text'),F('age','العمر المناسب','text'),F('ticket','السعر للفرد','price')],
   amen:['مرشد','معدات مرفقة','مواقف']}),
 C('historical-sites','hs','المزارات التاريخية','Historical Sites','column','none','dunes',{home:1,
   desc:'مزارات تاريخية بمعلومات تعريفية وتعليمات الزيارة والمحتوى التعليمي.',
   fields:[F('era','الحقبة','text'),F('visiting','ساعات الزيارة','text'),F('guided','جولات إرشادية','bool')],
   amen:['لوحات تعريفية','مواقف','مرشد']}),
 C('museums','ms','المتاحف','Museums','column','booking','interior',{home:1,
   desc:'متاحف بمعارضها ومقتنياتها وتذاكرها.',
   fields:[F('ticket','التذكرة','price'),F('exhibits','عدد المعارض','num'),F('events','الفعاليات','text')],
   amen:['معارض دائمة','متجر هدايا','مقهى','مواقف']}),
 C('mosques','mq','الجوامع والمساجد','Mosques','dome','none','dunes',{requiresVerification:true,
   desc:'تعريف بالجوامع والمساجد ومعالمها المعمارية ومرافقها العامة. لا حجوزات تجارية في هذا القسم.'}),
 C('hospitals','hp','المستشفيات','Hospitals','cross','appointment','city',{home:1,
   desc:'تعريف بالمستشفيات: الأقسام والمداخل والمواقف والمناطق المسموح بتصويرها. لا تُعرض بيانات مرضى.',
   fields:[F('departments','عدد الأقسام','num'),F('specialties','أبرز التخصصات','text'),F('parking','المواقف','bool'),F('entrances','المداخل','num')],
   amen:['مواقف','مصلى','صيدلية','كافتيريا']}),
 C('medical-centers','mc','المراكز الطبية','Medical Centers','cross','appointment','interior',{
   desc:'مراكز طبية بأقسامها وتخصصاتها ومواقعها.'}),
 C('private-schools','sc','المدارس الأهلية','Private Schools','book','request-visit','garden',{
   desc:'مدارس أهلية بمرافقها ومراحلها، مع طلب زيارة.',
   fields:[F('stage','المرحلة','text'),F('labs','المختبرات','bool'),F('playgrounds','الملاعب','bool'),F('theatre','المسرح','bool')],
   amen:['ملاعب','مختبرات','مكتبة','مسرح']}),
 C('universities','un','الجامعات','Universities','cap','inquiry','garden',{
   desc:'جامعات بحرمها وكلياتها ومرافقها وخدمات الطلاب.',
   fields:[F('colleges','عدد الكليات','num'),F('library','المكتبة','bool'),F('labs','المعامل','bool'),F('sports','المرافق الرياضية','bool')],
   amen:['مكتبة','معامل','ملاعب','سكن طلابي']}),
 C('government','gv','المنشآت الحكومية','Government Facilities','landmark','none','city',{
   desc:'تعريف بالمنشآت الحكومية وخدماتها للمناطق المسموح بعرضها. لا تُعرض معلومات حساسة.'}),
 C('airlines','al','شركات الطيران','Airlines','plane','inquiry','city',{desc:'شركات طيران ووجهاتها وخدماتها.'}),
 C('travel-agencies','tr','شركات السياحة والسفر','Travel Agencies','compass','quote','sea',{desc:'شركات سياحة وسفر وباقاتها ووجهاتها.'}),
 C('property-management','pm','شركات إدارة الأملاك','Property Management','building','quote','city',{desc:'شركات إدارة أملاك وخدماتها.'}),
 C('event-venues','ev','قاعات المناسبات','Event Venues','calendar','quote','interior',{home:1,sorts:PRICED_SORTS,priceBands:[5000,12000,25000],
   desc:'قاعات وأماكن مناسبات بسعتها وتجهيزاتها، مع طلب عرض سعر.',
   fields:[F('capacity','السعة','num','ضيف'),F('services','الخدمات','text'),F('hall','النوع','text')],
   amen:['مواقف','ضيافة','إضاءة وصوتيات','غرف تجهيز']}),
 C('event-organizers','eo','منظمو المناسبات','Event Organizers','calendar','quote','interior',{desc:'شركات تنظيم مناسبات وفعاليات.'}),
 C('malls','ml','المجمعات التجارية','Shopping Malls','bag','none','city',{home:1,
   desc:'مجمعات تجارية بمحلاتها ومطاعمها ومواقفها ومداخلها.',
   fields:[F('stores','عدد المحلات','num','محل'),F('parking','المواقف','text'),F('foodcourt','منطقة المطاعم','bool')],
   amen:['مواقف','مطاعم','ألعاب أطفال','مصليات']}),
 C('gyms','gm','النوادي الرياضية','Gyms & Sports Clubs','dumbbell','inquiry','interior',{desc:'نوادٍ رياضية وأجهزتها واشتراكاتها.'}),
 C('entertainment','en','مراكز الترفيه','Entertainment','spark','inquiry','garden',{desc:'مراكز ترفيه وألعاب وتجارب عائلية.'}),
 C('automotive','au','خدمات السيارات','Automotive Services','car','appointment','city',{desc:'ورش ومغاسل وخدمات صيانة للسيارات.'}),
 C('businesses','bz','الشركات والمكاتب','Businesses & Offices','briefcase','inquiry','city',{desc:'شركات ومكاتب تجارية وخدماتها.'}),
 C('real-estate-offices','ro','المكاتب العقارية','Real Estate Offices','building','inquiry','city',{desc:'مكاتب عقارية وعروضها.'}),
 C('business-centers','bc','مراكز الأعمال','Business Centers','briefcase','inquiry','city',{desc:'مراكز أعمال ومساحات عمل مشتركة.'}),
 C('car-showrooms','cs','معارض السيارات','Car Showrooms','car','inquiry','city',{desc:'معارض سيارات وعروضها.'}),
 C('destinations','ds','الوجهات السياحية','Destinations','compass','none','sea',{desc:'وجهات سياحية كاملة بما حولها من أماكن وتجارب.'}),
 C('farms','fm','المزارع','Farms','tree','booking','garden',{desc:'مزارع ومساحات خضراء للزيارة والإقامة.'}),
 C('camps','cp','المخيمات','Camps','tent','booking','dunes',{desc:'مخيمات ومواقع تخييم.'}),
 C('halls','hl','الصالات والمناسبات','Halls','calendar','quote','interior',{desc:'صالات للمناسبات الخاصة.'}),
 C('conference-centers','cc','مراكز المؤتمرات','Conference Centers','building','quote','interior',{desc:'مراكز مؤتمرات وقاعات اجتماعات كبيرة.'}),
 C('clinics','cl','العيادات','Clinics','cross','appointment','interior',{desc:'عيادات بتخصصاتها ومواقعها.'}),
 C('cultural-centers','cu','المراكز الثقافية','Cultural Centers','column','inquiry','interior',{desc:'مراكز ثقافية وفعالياتها.'}),
 C('parks','pk','الحدائق','Parks','tree','none','garden',{home:1,desc:'حدائق ومنتزهات عامة.'}),
 C('waterfronts','wf','الشواطئ والواجهات','Waterfronts','wave','none','sea',{home:1,desc:'شواطئ وواجهات بحرية.'}),
 C('markets','mk','الأسواق','Markets','store','none','city',{desc:'أسواق شعبية وتجارية.'})
];
const CAT=Object.fromEntries(CATS.map(c=>[c.slug,c]));
const CITY=Object.fromEntries(CITIES.map(c=>[c.slug,c]));

/* ---------------- demo generator ---------------- */
function rngf(seed){let s=(seed>>>0)||1;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const round50=n=>Math.round(n/50)*50;
const yes=(r,p)=>r()<p;
const GEN={
 chalets:r=>{const g=pick(r,[8,10,12,15,20,25]);const wd=round50(380+g*26+r()*260);
  return{price:wd,unit:'لليلة',a:{guests:g,rooms:Math.ceil(g/5),baths:Math.ceil(g/6)+1,pool:yes(r,.8),kitchen:yes(r,.85),seating:pick(r,['جلسة خارجية وجلسة داخلية','مجلس وجلسة حديقة','جلسات مظللة بجانب المسبح']),games:pick(r,['طاولة بلياردو','ملعب أطفال وتنس طاولة','ملعب كرة وألعاب فيديو']),parking:pick(r,[2,3,4,6]),privacy:pick(r,['مدخل مستقل','سور عالٍ ومدخل مستقل','سور خاص']),weekday:wd,weekend:round50(wd*1.35)}}},
 hotels:r=>{const p=round50(320+r()*700);return{price:p,unit:'لليلة',a:{rooms:pick(r,[60,90,120,180,240]),roomTypes:'غرفة مفردة، غرفة مزدوجة، جناح',pool:yes(r,.8),gym:yes(r,.9),spa:yes(r,.5),restaurants:pick(r,[1,2,3]),parking:true}}},
 resorts:r=>{const p=round50(800+r()*1400);return{price:p,unit:'لليلة',a:{rooms:pick(r,[40,70,110]),pool:true,beach:yes(r,.7),kids:yes(r,.8)}}},
 'real-estate':r=>{const p=Math.round((520000+r()*1900000)/10000)*10000;return{price:p,unit:'تبدأ من',a:{kind:pick(r,['مشروع سكني','مشروع تجاري','مجمع فلل']),units:pick(r,[24,48,96,180]),area:pick(r,['من 110 إلى 240 م²','من 180 إلى 420 م²','من 90 إلى 160 م²']),state:pick(r,['جاهز للتسليم','تحت الإنشاء'])}}},
 restaurants:r=>({price:round50(40+r()*120),unit:'للفرد (تقريبي)',a:{cuisine:pick(r,['مأكولات شرقية','مأكولات بحرية','مشويات','إيطالي','مأكولات عالمية']),families:yes(r,.8),singles:yes(r,.6),outdoor:yes(r,.6),privateRoom:yes(r,.4)}}),
 cafes:r=>({price:null,a:{speciality:pick(r,['قهوة مختصة','حلويات ومخبوزات','مشروبات باردة','قهوة وكتب']),outdoor:yes(r,.7),families:yes(r,.8),wifi:true}}),
 'tourist-attractions':r=>{const t=yes(r,.5)?round50(20+r()*80):null;return{price:t,unit:'للدخول',a:{duration:pick(r,['ساعة إلى ساعتين','نصف يوم','ساعتان']),age:pick(r,['كل الأعمار','من 6 سنوات','للعائلات']),ticket:t}}},
 activities:r=>{const p=round50(60+r()*320);return{price:p,unit:'للفرد',a:{duration:pick(r,['ساعة','ساعتان','3 ساعات']),age:pick(r,['من 8 سنوات','من 12 سنة','كل الأعمار']),ticket:p}}},
 'historical-sites':r=>({price:null,a:{era:pick(r,['حقبة تجريبية أ','حقبة تجريبية ب','حقبة تجريبية ج']),visiting:'من الأحد إلى الخميس، 9 ص – 4 م',guided:yes(r,.6)}}),
 museums:r=>({price:round50(20+r()*50),unit:'للتذكرة',a:{ticket:round50(20+r()*50),exhibits:pick(r,[4,6,9]),events:'فعاليات موسمية (تجريبي)'}}),
 hospitals:r=>({price:null,a:{departments:pick(r,[14,22,30]),specialties:'الباطنية، العظام، الأطفال، الطوارئ (بيان تجريبي)',parking:true,entrances:pick(r,[2,3,4])}}),
 universities:r=>({price:null,a:{colleges:pick(r,[6,9,12]),library:true,labs:true,sports:yes(r,.8)}}),
 'private-schools':r=>({price:null,a:{stage:pick(r,['ابتدائي ومتوسط','ابتدائي إلى ثانوي','رياض أطفال وابتدائي']),labs:true,playgrounds:true,theatre:yes(r,.5)}}),
 malls:r=>({price:null,a:{stores:pick(r,[80,140,220]),parking:pick(r,['مواقف أرضية ومتعددة الطوابق','مواقف أرضية']),foodcourt:true}}),
 'event-venues':r=>{const cap=pick(r,[150,300,500,800]);const p=round50(cap*30+r()*3000);return{price:p,unit:'تبدأ من',a:{capacity:cap,services:'ضيافة، إضاءة، صوتيات (تجريبي)',hall:pick(r,['قاعة مغلقة','قاعة وحديقة','قاعة فندقية'])}}}
};
/* [word, cityCode] per category */
const SEEDS={
 chalets:['شاليه',[['الموج','khobar'],['النخيل','dammam'],['الواحة','riyadh'],['الشراع','khobar'],['اللؤلؤ','dammam'],['السدر','riyadh'],['الأفق','jeddah'],['الغروب','dhahran'],['الجُمان','jeddah'],['الربيع','khobar']]],
 hotels:['فندق',[['الخليج','dammam'],['الواحة','riyadh'],['الكورنيش','khobar'],['الشاطئ','jeddah'],['الأفق','riyadh']]],
 resorts:['منتجع',[['الرمال','dammam'],['المرجان','jeddah']]],
 restaurants:['مطعم',[['الميناء','khobar'],['السفرة','riyadh'],['البحر','jeddah'],['المجلس','dammam'],['الساحة','dhahran']]],
 cafes:['مقهى',[['الشرفة','khobar'],['الحي','riyadh'],['الموج','jeddah'],['الركن','dammam'],['الظل','dhahran']]],
 'tourist-attractions':['',[['ممشى النخيل','khobar'],['مرفأ اللؤلؤ','dammam'],['حديقة الأفق','riyadh'],['ساحة البلدة','jeddah'],['منصة الغروب','dhahran']]],
 activities:['',[['تجربة القارب','jeddah'],['رحلة الكثبان','riyadh'],['مسار الدراجات','khobar']]],
 'historical-sites':['',[['قلعة الصدى','riyadh'],['بيت الحجاز القديم','jeddah'],['حصن الساحل','dammam']]],
 museums:['متحف',[['الذاكرة','riyadh'],['البحر','jeddah'],['الخليج','dammam']]],
 hospitals:['مستشفى',[['الشفاء','riyadh'],['الواحة','dammam'],['النور','jeddah']]],
 universities:['جامعة',[['الأفق','dhahran'],['الرؤية','riyadh'],['البحر الأحمر','jeddah']]],
 'private-schools':['مدرسة',[['الغد','khobar'],['النجوم','riyadh'],['الريادة','jeddah']]],
 malls:['مجمع',[['الواجهة','khobar'],['الأبراج','riyadh'],['الميدان','jeddah']]],
 'real-estate':['مشروع',[['الربى السكني','riyadh'],['أفق الشاطئ','khobar'],['حدائق الورود','jeddah']]],
 'event-venues':['قاعة',[['الاحتفاء','dammam'],['الزهور','riyadh'],['اللقاء','jeddah']]]
};
const DEMO_FOR='سجل توضيحي تجريبي لا يمثل منشأة حقيقية. أضف المعلومات المعتمدة من لوحة الإدارة قبل النشر العام.';
const SHORT={
 chalets:p=>`يتسع لـ ${p.a.guests} أشخاص${p.a.pool?' مع مسبح':''} في حي ${p.district}.`,
 hotels:p=>`${p.a.rooms} غرفة بمرافق متنوعة في حي ${p.district}.`,
 restaurants:p=>`${p.a.cuisine} في حي ${p.district}.`,
 cafes:p=>`${p.a.speciality} في حي ${p.district}.`,
 'real-estate':p=>`${p.a.kind} من ${p.a.units} وحدة، ${p.a.state}.`,
 'event-venues':p=>`تتسع لـ ${p.a.capacity} ضيف في حي ${p.district}.`
};
const HOURS={chalets:'الدخول 4:00 م · الخروج 12:00 ظهرًا',hotels:'استقبال على مدار الساعة',restaurants:'يوميًا 12:00 م – 12:00 ص',cafes:'يوميًا 8:00 ص – 1:00 ص',default:'يوميًا 9:00 ص – 10:00 م'};
const NOHOURS=new Set(['real-estate','event-venues','historical-sites']);

const PLACES=[];
(function build(){
  Object.entries(SEEDS).forEach(([cat,[prefix,list]])=>{
    const c=CAT[cat];
    list.forEach(([word,citySlug],i)=>{
      const city=CITY[citySlug];
      const r=rngf(hash(cat+word+i));
      const g=(GEN[cat]||(()=>({price:null,a:{}})))(r);
      const district=pick(r,city.districts);
      const nn=String(i+1).padStart(2,'0');
      const name=(prefix?prefix+' ':'')+word+' التجريبي';
      const has360=c.requires360?true:r()>.12;
      const p={
        id:`${c.ab}${city.code}${nn}`,slug:`${c.ab}-${city.code}-${nn}`,cat,city:citySlug,district,name,
        en:`Demo ${c.en.split(' ')[0]} ${nn}`,
        a:g.a,price:g.price,unit:g.unit||'',
        rating:Math.round((3.9+r()*1)*10)/10,
        daysAgo:Math.floor(2+r()*210),bookings:Math.floor(3+r()*140),views:Math.floor(200+r()*9000),
        featured:false,status:'published',demo:true,
        lat:city.lat+(r()-.5)*(citySlug==='riyadh'?.22:citySlug==='jeddah'?.16:.07),
        lng:city.lng+(r()-.5)*(citySlug==='riyadh'?.22:citySlug==='jeddah'?.16:.07),
        seed:hash(cat+word)%9973,
        tour:has360?{provider:'demo',embedUrl:null,thumbnail:null,id:`demo-${c.ab}${city.code}${nn}`}:null,
        amen:(()=>{const pool=[...c.amen];const out=[];while(pool.length&&out.length<Math.min(5,c.amen.length)){out.push(pool.splice(Math.floor(r()*pool.length),1)[0])}return out})(),
        hours:NOHOURS.has(cat)?null:(HOURS[cat]||HOURS.default),
        phone:'+966 50 000 0000',wa:'+966 50 000 0001',site:'example.com/demo',social:'@jawlat360_demo'
      };
      p.short=(SHORT[cat]||(x=>`سجل تجريبي في حي ${x.district} يوضح كيف تُعرض بيانات هذا القطاع.`))(p);
      p.desc=`${p.short} ${DEMO_FOR}`;
      p.featured=(i===0&&['chalets','cafes','resorts','tourist-attractions','hotels'].includes(cat))||(i===3&&cat==='chalets');
      PLACES.push(p);
    });
  });
})();
const PL=Object.fromEntries(PLACES.map(p=>[p.slug,p]));
const PLID=Object.fromEntries(PLACES.map(p=>[p.id,p]));

const ARTICLES=[
 {slug:'read-a-tour',city:'riyadh',ar:'كيف تقرأ الجولة الافتراضية قبل الزيارة',
  lead:'مقال تجريبي — لا يمثل توصية بمنشأة فعلية.',
  body:['ابدأ من نقطة المدخل، فهي تخبرك كيف تبدو الوصلة بين الشارع والمكان. ثم انتقل بين الغرف أو المساحات بالترتيب الذي ستمر به فعلًا عند الزيارة.','لاحظ ما لا تظهره الصورة الثابتة: عرض الممرات، ارتفاع الأسقف، المسافة بين الجلسات، وموقع المواقف من المدخل.','وإذا وجدت نقطة معلومات داخل الجولة، فاقرأها قبل أن تكمل. هي المكان الذي تضع فيه المنشأة ما يلزمك معرفته.']},
 {slug:'questions-before-chalet',city:'khobar',ar:'أسئلة تطرحها قبل اختيار شاليه',
  lead:'مقال تجريبي — قائمة عامة للتفكير.',
  body:['ابدأ بعدد الأشخاص الفعلي، لا الحد الأقصى. السعة المكتوبة تعني أقصى عدد، وراحة المجموعة غالبًا أقل منه.','قارن بين سعر أيام الأسبوع وسعر الويكند، وانتبه للمواقف والجلسات الخارجية، فهي ما تحدد شكل اليوم بعد الوصول.','ما كتبه المالك عن الخصوصية والمرافق معلومة منه. اقرأه مع الجولة، وإن غاب شيء فاسأل عنه قبل القرار.']},
 {slug:'what-photos-miss',city:'jeddah',ar:'ما الذي تقوله الصور وما الذي لا تقوله',
  lead:'مقال تجريبي — يوضح فكرة المنصة.',
  body:['الصورة تعرض زاوية اختارها المصور. الجولة تعرض المكان من حولك، وتسمح لك بأن تنظر حيث تريد أنت.','لهذا تجمع جولات 360 بين المشاهدة والمعلومة: جولة تُرى، وبيانات منظمة تُقرأ، وموقع يُعرف، ثم قرارك أنت.']}
];
const PARTNER_TYPES=[
 ['القهوة والمقاهي','مقاهٍ تقدم عروضًا لزوار المنصة.'],['المطاعم','مطاعم بعروض وطلبات حجز.'],['الفنادق','فنادق ومنتجعات تعرض غرفها.'],['السفر والسياحة','وكالات سفر وباقات.'],['الأنشطة','تجارب وأنشطة ترفيهية.'],['خدمات السيارات','ورش ومغاسل وخدمات.'],['الشركات','برامج مزايا للموظفين.'],['المؤثرون','سفراء بروابط معلنة وواضحة.'],['الفعاليات','منظمو فعاليات ومناسبات.'],['السياحة','جهات ومنظمو وجهات.']
];
/* ---------- QR encoder (byte mode, EC level M, versions 1-10; no external library) ---------- */
const QR=(()=>{
const EXP=new Array(512),LOG=new Array(256);let x=1;
for(let i=0;i<255;i++){EXP[i]=x;LOG[x]=i;x<<=1;if(x&256)x^=0x11d}
for(let i=255;i<512;i++)EXP[i]=EXP[i-255];
const mul=(a,b)=>a&&b?EXP[LOG[a]+LOG[b]]:0;
const rsGen=n=>{let g=[1];for(let i=0;i<n;i++){const h=new Array(g.length+1).fill(0);for(let j=0;j<g.length;j++){h[j]^=g[j];h[j+1]^=mul(g[j],EXP[i])}g=h}return g};
const rsEnc=(d,n)=>{const g=rsGen(n),r=new Array(n).fill(0);for(const b of d){const f=b^r.shift();r.push(0);if(f)for(let i=0;i<n;i++)r[i]^=mul(g[i+1],f)}return r};
const T=[null,[10,1,16,0,0],[16,1,28,0,0],[26,1,44,0,0],[18,2,32,0,0],[24,2,43,0,0],[16,4,27,0,0],[18,4,31,0,0],[22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44]];
const AL=[null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];
const dataCw=v=>{const t=T[v];return t[1]*t[2]+t[3]*t[4]};
function encode(text){
  const bytes=Array.from(new TextEncoder().encode(text));let v=1;
  for(;v<=10;v++){if(dataCw(v)*8>=4+(v<10?8:16)+8*bytes.length)break}
  if(v>10)return null;
  const bits=[];const put=(val,n)=>{for(let i=n-1;i>=0;i--)bits.push((val>>i)&1)};
  put(4,4);put(bytes.length,v<10?8:16);bytes.forEach(b=>put(b,8));
  const cap=dataCw(v)*8;put(0,Math.min(4,cap-bits.length));while(bits.length%8)bits.push(0);
  const cw=[];for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++)b=b<<1|bits[i+j];cw.push(b)}
  for(let p=0;cw.length<dataCw(v);p^=1)cw.push(p?0x11:0xEC);
  const t=T[v],blocks=[];let o=0;
  for(let i=0;i<t[1];i++){blocks.push(cw.slice(o,o+t[2]));o+=t[2]}
  for(let i=0;i<t[3];i++){blocks.push(cw.slice(o,o+t[4]));o+=t[4]}
  const ecs=blocks.map(b=>rsEnc(b,t[0])),out=[];
  const maxd=Math.max(...blocks.map(b=>b.length));
  for(let i=0;i<maxd;i++)blocks.forEach(b=>{if(i<b.length)out.push(b[i])});
  for(let i=0;i<t[0];i++)ecs.forEach(e=>out.push(e[i]));
  const n=17+4*v,m=Array.from({length:n},()=>new Array(n).fill(0)),res=Array.from({length:n},()=>new Array(n).fill(false));
  const sf=(r,c,val)=>{m[r][c]=val?1:0;res[r][c]=true};
  const finder=(r0,c0)=>{for(let dy=-1;dy<=7;dy++)for(let dx=-1;dx<=7;dx++){const r=r0+dy,c=c0+dx;if(r<0||c<0||r>=n||c>=n)continue;sf(r,c,dy>=0&&dy<=6&&dx>=0&&dx<=6&&(dy===0||dy===6||dx===0||dx===6||(dy>=2&&dy<=4&&dx>=2&&dx<=4)))}};
  finder(0,0);finder(0,n-7);finder(n-7,0);
  for(let i=8;i<n-8;i++){sf(6,i,i%2===0);sf(i,6,i%2===0)}
  const ap=AL[v];
  ap.forEach((ar,i)=>ap.forEach((ac,j)=>{if((i===0&&j===0)||(i===0&&j===ap.length-1)||(i===ap.length-1&&j===0))return;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)sf(ar+dy,ac+dx,Math.max(Math.abs(dy),Math.abs(dx))!==1)}));
  for(let i=0;i<9;i++){if(!res[8][i])sf(8,i,0);if(!res[i][8])sf(i,8,0)}
  for(let i=0;i<8;i++){sf(8,n-1-i,0);sf(n-1-i,8,0)}
  sf(n-8,8,1);
  if(v>=7){let r=v<<12;for(let i=17;i>=12;i--)if((r>>i)&1)r^=0x1F25<<(i-12);const vi=v<<12|r;for(let i=0;i<18;i++){const b=(vi>>i)&1,a=Math.floor(i/3),c=i%3+n-11;sf(a,c,b);sf(c,a,b)}}
  const dbits=[];out.forEach(b=>{for(let i=7;i>=0;i--)dbits.push((b>>i)&1)});
  let k=0,up=true;
  for(let col=n-1;col>0;col-=2){if(col===6)col--;
    for(let s=0;s<n;s++){const r=up?n-1-s:s;for(let d=0;d<2;d++){const c=col-d;if(!res[r][c]){m[r][c]=k<dbits.length?dbits[k]:0;k++}}}
    up=!up}
  const MASK=[(r,c)=>(r+c)%2===0,(r)=>r%2===0,(r,c)=>c%3===0,(r,c)=>(r+c)%3===0,(r,c)=>(Math.floor(r/2)+Math.floor(c/3))%2===0,(r,c)=>(r*c)%2+(r*c)%3===0,(r,c)=>((r*c)%2+(r*c)%3)%2===0,(r,c)=>((r+c)%2+(r*c)%3)%2===0];
  const build=mk=>{
    const q=m.map(r=>r.slice());
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(!res[r][c]&&MASK[mk](r,c))q[r][c]^=1;
    let rem=mk<<10;for(let i=14;i>=10;i--)if((rem>>i)&1)rem^=0x537<<(i-10);
    const fb=((mk<<10)|rem)^0x5412;
    for(let i=0;i<15;i++){const b=(fb>>i)&1;
      if(i<6)q[i][8]=b;else if(i<8)q[i+1][8]=b;else q[n-15+i][8]=b;
      if(i<8)q[8][n-i-1]=b;else if(i<9)q[8][15-i]=b;else q[8][15-i-1]=b}
    q[n-8][8]=1;return q};
  const pen=q=>{let p=0;
    for(let a=0;a<2;a++){for(let i=0;i<n;i++){let run=1;for(let j=1;j<n;j++){const cur=a?q[j][i]:q[i][j],prev=a?q[j-1][i]:q[i][j-1];if(cur===prev){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}}}
    for(let r=0;r<n-1;r++)for(let c=0;c<n-1;c++){const s=q[r][c]+q[r][c+1]+q[r+1][c]+q[r+1][c+1];if(s===0||s===4)p+=3}
    const pa=[1,0,1,1,1,0,1,0,0,0,0],pb=[0,0,0,0,1,0,1,1,1,0,1];
    for(let a=0;a<2;a++)for(let i=0;i<n;i++)for(let j=0;j<=n-11;j++){let m1=true,m2=true;for(let k=0;k<11;k++){const val=a?q[j+k][i]:q[i][j+k];if(val!==pa[k])m1=false;if(val!==pb[k])m2=false}if(m1)p+=40;if(m2)p+=40}
    let dark=0;q.forEach(r=>r.forEach(b=>dark+=b));p+=Math.floor(Math.abs(dark*100/(n*n)-50)/5)*10;return p};
  let best=null,bp=1e9;for(let mk=0;mk<8;mk++){const q=build(mk),p=pen(q);if(p<bp){bp=p;best=q}}
  return best;
}
function svg(text,px){
  const q=encode(text);if(!q)return '';const n=q.length,M=4;let d='';
  q.forEach((row,r)=>{let c=0;while(c<n){if(row[c]){let e=c;while(e<n&&row[e])e++;d+=`M${c+M} ${r+M}h${e-c}v1h-${e-c}z`;c=e}else c++}});
  const s=n+2*M;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${px||200}" height="${px||200}" shape-rendering="crispEdges" role="img"><rect width="${s}" height="${s}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}
return {encode,svg};
})();
/* ================= APP ================= */
(function(){
'use strict';
const app=document.getElementById('app');
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('en-US');
const reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- icons (24px line set) ---------- */
const ICON={
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 pin:'<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
 arrow:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 chev:'<path d="M15 6l-6 6 6 6"/>',
 diag:'<path d="M17 7L7 17M7 8v9h9"/>',
 cube:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
 share:'<circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="currentColor"/>',
 grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 minus:'<path d="M5 12h14"/>',
 expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
 target:'<circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
 cam:'<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 bed:'<path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-8v5"/><circle cx="7" cy="11" r="1.5"/>',
 palm:'<path d="M12 21V11M12 11c-1-4-5-5-8-4 3 0 5 1 6 3M12 11c1-4 5-5 8-4-3 0-5 1-6 3M12 11c-3-2-3-6 0-8 3 2 3 6 0 8"/>',
 building:'<path d="M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18"/>',
 fork:'<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
 cup:'<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 9h2a2 2 0 0 1 0 4h-2M7 3v2M11 3v2"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 ticket:'<path d="M3 8h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 8v10"/>',
 column:'<path d="M3 9l9-5 9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
 dome:'<path d="M5 20v-7a7 7 0 0 1 14 0v7M3 20h18M12 3v3M10 20v-4a2 2 0 0 1 4 0v4"/>',
 cross:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
 cap:'<path d="M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6"/>',
 book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13"/>',
 bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
 briefcase:'<path d="M3 8h18v12H3zM9 8V5h6v3M3 13h18"/>',
 landmark:'<path d="M12 2v3M3 9l9-4 9 4zM5 9v9M9 9v9M15 9v9M19 9v9M3 20h18"/>',
 plane:'<path d="M10 14L3 11l1-2 8 1 5-6a2 2 0 0 1 3 3l-6 5 1 8-2 1-3-7z"/>',
 car:'<path d="M4 16v-3l2-5h12l2 5v3zM4 16v2h3v-2M17 16v2h3v-2"/><circle cx="8" cy="13" r=".8"/><circle cx="16" cy="13" r=".8"/>',
 calendar:'<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>',
 dumbbell:'<path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/>',
 spark:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
 tree:'<path d="M12 21v-6M12 15a5 5 0 1 1 1-9.9A4 4 0 0 1 12 15"/>',
 wave:'<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
 tent:'<path d="M3 20L12 4l9 16zM12 20v-6"/>',
 store:'<path d="M4 9l1-5h14l1 5M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M5 11v9h14v-9M10 20v-5h4v5"/>'
};
const ic=(n,s=20,sw=1.7)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]||ICON.compass}</svg>`;
const logoMark=(s=40)=>`<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 37s13-9.6 13-20a13 13 0 1 0-26 0c0 10.4 13 20 13 20z" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="17" r="7" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="17" r="2.6" fill="currentColor"/></svg>`;

/* ---------- scene illustrations (placeholders, generated, license-free) ---------- */
const PALS=[
 ['#27455a','#e3b98a','#f6e3bd','#4a6d73','#2f5a54','#1c3b36'],
 ['#7aa6a8','#f1dcb8','#fff3d6','#6f9a93','#4c8077','#2a5a50'],
 ['#0f222b','#35566a','#d9c08f','#1d3a43','#17302f','#0f211e'],
 ['#8fc1c9','#e8efe2','#fff7df','#79aea1','#4a9078','#2b6a56'],
 ['#d9b98a','#f3e3c2','#fff4d9','#c9a273','#a97f55','#6b4f3a']
];
function palm(x,b,h,col){
  const tx=x+h*.06,ty=b-h;let o=`<path d="M${x} ${b}Q${x+h*.1} ${b-h*.5} ${tx} ${ty}" stroke="${col}" stroke-width="${Math.max(3,h*.035)}" fill="none" stroke-linecap="round"/>`;
  [[-1,.25],[-.7,-.05],[-.3,-.25],[.3,-.25],[.7,-.05],[1,.25]].forEach(([dx,dy])=>{
    o+=`<path d="M${tx} ${ty}q${dx*h*.28} ${-h*.12+dy*h*.1} ${dx*h*.42} ${dy*h*.34+h*.06}" stroke="${col}" stroke-width="${Math.max(3,h*.04)}" fill="none" stroke-linecap="round"/>`});
  return o;
}
function sceneBody(kind,seed,W,H,pal){
  const r=rngf(seed*131+kind.length*7+1);const [s1,s2,sun,far,mid,near]=pal;
  let o=`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`;
  const sx=W*(.15+r()*.7);
  if(kind==='sea'){
    const hz=H*.6;
    o+=`<circle cx="${sx}" cy="${hz-H*.04}" r="${H*.09}" fill="${sun}" opacity=".92"/>`;
    o+=`<rect y="${hz}" width="${W}" height="${H*.22}" fill="${far}"/>`;
    for(let i=0;i<7;i++)o+=`<rect x="${r()*W}" y="${hz+H*.02+i*H*.028}" width="${W*(.08+r()*.18)}" height="3" fill="#fff" opacity=".16"/>`;
    o+=`<path d="M0 ${H*.8}L${W} ${H*.76}V${H}H0z" fill="${mid}"/><path d="M0 ${H*.9}L${W} ${H*.87}V${H}H0z" fill="${near}"/>`;
    for(let i=0;i<4;i++)o+=`<rect x="${W*(.08+i*.24)+r()*20}" y="${H*.74}" width="${W*.05}" height="${H*.05}" rx="4" fill="${near}" opacity=".7"/>`;
    o+=palm(W*(.08+r()*.1),H*.9,H*.55,near)+palm(W*(.78+r()*.12),H*.95,H*.7,near)+palm(W*.34,H*.86,H*.4,mid);
  }else if(kind==='city'){
    o+=`<circle cx="${sx}" cy="${H*.3}" r="${H*.07}" fill="${sun}" opacity=".85"/>`;
    for(let row=0;row<2;row++){let x=-10;const col=row?mid:far,base=row?H*.82:H*.76;
      while(x<W){const w=W*(.04+r()*.06),h=H*(row?.2+r()*.34:.22+r()*.4);o+=`<rect x="${x}" y="${base-h}" width="${w}" height="${h}" fill="${col}"/>`;
        if(row)for(let k=0;k<Math.floor(h/26);k++)o+=`<rect x="${x+w*.2}" y="${base-h+10+k*26}" width="${w*.18}" height="8" fill="${sun}" opacity="${.25+r()*.4}"/>`;
        x+=w+3}}
    o+=`<rect y="${H*.8}" width="${W}" height="${H*.2}" fill="${near}"/><path d="M0 ${H*.9}H${W}" stroke="${sun}" stroke-opacity=".25" stroke-width="3"/>`;
  }else if(kind==='pool'){
    o+=`<rect y="${H*.3}" width="${W}" height="${H*.34}" fill="${mid}"/>`;
    for(let i=0;i<5;i++){const ax=W*(.06+i*.19),aw=W*.12;o+=`<path d="M${ax} ${H*.64}V${H*.5}a${aw/2} ${aw/2} 0 0 1 ${aw} 0V${H*.64}z" fill="${far}"/>`}
    o+=`<rect y="${H*.64}" width="${W}" height="${H*.36}" fill="${near}"/><rect x="${W*.14}" y="${H*.7}" width="${W*.72}" height="${H*.2}" rx="10" fill="#8cc4bf"/>`;
    for(let i=0;i<6;i++)o+=`<rect x="${W*.18+r()*W*.5}" y="${H*.73+i*H*.025}" width="${W*.12}" height="3" fill="#fff" opacity=".35"/>`;
    o+=palm(W*.06,H*.97,H*.6,mid)+palm(W*.93,H*.97,H*.5,mid);
    o+=`<circle cx="${sx}" cy="${H*.16}" r="${H*.06}" fill="${sun}" opacity=".85"/>`;
  }else if(kind==='interior'){
    o+=`<rect y="${H*.18}" width="${W}" height="${H*.62}" fill="${mid}"/>`;
    for(let i=0;i<3;i++){const ax=W*(.1+i*.3),aw=W*.2;o+=`<path d="M${ax} ${H*.8}V${H*.42}a${aw/2} ${aw/2} 0 0 1 ${aw} 0V${H*.8}z" fill="${far}"/><path d="M${ax+aw*.14} ${H*.8}V${H*.44}a${aw*.36} ${aw*.36} 0 0 1 ${aw*.72} 0V${H*.8}z" fill="${s2}" opacity=".55"/>`}
    o+=`<rect y="${H*.8}" width="${W}" height="${H*.2}" fill="${near}"/>`;
    for(let i=0;i<4;i++)o+=`<line x1="${W*(.2+i*.2)}" y1="${H*.18}" x2="${W*(.2+i*.2)}" y2="${H*.3}" stroke="${sun}" stroke-width="2"/><circle cx="${W*(.2+i*.2)}" cy="${H*.32}" r="${H*.03}" fill="${sun}" opacity=".9"/>`;
    o+=`<ellipse cx="${W*.5}" cy="${H*.86}" rx="${W*.16}" ry="${H*.045}" fill="${far}"/><rect x="${W*.42}" y="${H*.74}" width="${W*.16}" height="${H*.1}" rx="8" fill="${mid}"/>`;
  }else if(kind==='dunes'){
    o+=`<circle cx="${sx}" cy="${H*.32}" r="${H*.1}" fill="${sun}" opacity=".9"/>`;
    [[.58,far],[.7,mid],[.84,near]].forEach(([y,c],i)=>{let d=`M0 ${H}V${H*y}`;for(let k=0;k<=8;k++)d+=`Q${W*(k+.5)/8} ${H*y-H*(.05+r()*.08)} ${W*(k+1)/8} ${H*y+H*(r()*.04)}`;o+=`<path d="${d}V${H}z" fill="${c}"/>`});
  }else{ /* garden */
    o+=`<circle cx="${sx}" cy="${H*.26}" r="${H*.07}" fill="${sun}" opacity=".9"/>`;
    o+=`<ellipse cx="${W*.25}" cy="${H*.78}" rx="${W*.5}" ry="${H*.2}" fill="${far}"/><ellipse cx="${W*.8}" cy="${H*.8}" rx="${W*.5}" ry="${H*.22}" fill="${mid}"/>`;
    for(let i=0;i<7;i++){const tx=W*(.05+r()*.9),ty=H*(.62+r()*.2),tr=H*(.05+r()*.06);o+=`<rect x="${tx-3}" y="${ty}" width="6" height="${tr*1.2}" fill="${near}"/><circle cx="${tx}" cy="${ty}" r="${tr}" fill="${r()>.5?mid:near}"/>`}
    o+=`<path d="M${W*.4} ${H}L${W*.52} ${H*.84}L${W*.6} ${H*.84}L${W*.72} ${H}z" fill="${s2}" opacity=".7"/><rect y="${H*.95}" width="${W}" height="${H*.05}" fill="${near}"/>`;
  }
  return o;
}
const _uri={};
function sceneUri(kind,seed,W,H,pi){
  const key=[kind,seed,W,H,pi].join('|');if(_uri[key])return _uri[key];
  const pal=PALS[pi==null?seed%PALS.length:pi];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${sceneBody(kind,seed,W,H,pal)}</svg>`;
  return _uri[key]='data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function panoUri(kind,seed,pi){
  const key='pano|'+[kind,seed,pi].join('|');if(_uri[key])return _uri[key];
  const body=sceneBody(kind,seed,1200,600,PALS[pi]);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 600"><g>${body}</g><g transform="translate(2400 0) scale(-1 1)">${body}</g></svg>`;
  return _uri[key]='data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const GALK=[null,'interior','garden','pool','sea'];
const img=(p,k=0,W=800,H=600)=>sceneUri(k===0?CAT[p.cat].scene:GALK[k]||'garden',p.seed+k*17,W,H,(p.seed+k)%PALS.length);
const cityImg=(c,W=600,H=800)=>sceneUri(c.scene[0],hash(c.slug)%997,W,H,c.scene[1]);
const bg=u=>`background-image:url('${u}')`;

/* ---------- derived data ---------- */
const cntCity={},cntCat={},cntTour={};
PLACES.forEach(p=>{cntCity[p.city]=(cntCity[p.city]||0)+1;cntCat[p.cat]=(cntCat[p.cat]||0)+1;if(p.tour)cntTour[p.city]=(cntTour[p.city]||0)+1});
const activeCities=CITIES.filter(c=>c.active);
let toursAll=PLACES.filter(p=>p.tour);
function derive(){[cntTour,cntCity,cntCat].forEach(o=>{for(const k in o)delete o[k]});PLACES.forEach(p=>{cntCity[p.city]=(cntCity[p.city]||0)+1;cntCat[p.cat]=(cntCat[p.cat]||0)+1;if(p.tour)cntTour[p.city]=(cntTour[p.city]||0)+1});toursAll=PLACES.filter(p=>p.tour)}

/* ---------- search ---------- */
const norm=s=>String(s||'').toLowerCase().replace(/[ً-ٰٟـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
const hay=p=>norm([p.name,p.en,CITY[p.city].ar,CITY[p.city].en,CAT[p.cat].ar,CAT[p.cat].en,p.district,p.amen.join(' '),p.short].join(' '));
PLACES.forEach(p=>p._h=hay(p));
function searchPlaces(q){
  const toks=norm(q).split(' ').filter(Boolean);if(!toks.length)return [];
  return PLACES.filter(p=>toks.every(t=>p._h.includes(t)));
}

/* ---------- small renderers ---------- */
function priceHTML(p){
  if(p.price==null)return '';
  if(/^تبدأ/.test(p.unit))return `<span class="price num">تبدأ من <b>${fmt(p.price)}</b> ر.س</span>`;
  return `<span class="price num"><b>${fmt(p.price)}</b> ر.س ${esc(p.unit)}</span>`;
}
const isDemo=p=>p.demo!==false;
const rateTxt=p=>p.rating?p.rating.toFixed(1):'جديد';
function badgeSet(p){ /* badges come only from record state */
  let l='',r='';
  if(p.tour)l+=`<span class="bd bd-tour">${ic('cube',13)} جولة 360°</span>`;
  if(verOk(p.id))l+=`<span class="bd bd-ok">${ic('check',13)} تم التحقق</span>`;
  if(p.featured)l+=`<span class="bd bd-pick">اختيار جولات</span>`;
  r=isDemo(p)?`<span class="bd bd-demo">تجريبي</span>`:'';
  return `<div class="bds"><div>${l}</div><div>${r}</div></div>`;
}
function pcard(p){
  const c=CAT[p.cat],ci=CITY[p.city];
  return `<a class="pcard" href="#place-${p.slug}"><div class="pimg" style="${bg(img(p,0))}" role="img" aria-label="صورة توضيحية">${badgeSet(p)}</div>
  <div class="pbody"><div class="pmeta">${ci.ar} · ${c.ar}</div><h3>${esc(p.name)}</h3><p>${esc(p.short)}</p>
  <div class="pfoot"><span class="rate num">${ic('star',14)} ${rateTxt(p)}</span>${priceHTML(p)}<span class="go">استكشف ${ic('arrow',16)}</span></div></div></a>`;
}
function tcard(p){
  const c=CAT[p.cat],ci=CITY[p.city];
  return `<article class="tcard"><button class="pimg" data-act="tour" data-id="${p.id}" style="${bg(img(p,0,800,500))}" aria-label="ابدأ جولة 360 — ${esc(p.name)}">${badgeSet(p)}<span class="play"><span>${ic('cube',28)}</span></span></button>
  <div class="pbody"><div class="pmeta">${ci.ar} · ${c.ar}</div><h3>${esc(p.name)}</h3>
  <div class="acts"><button class="btn btn-brand btn-sm" data-act="tour" data-id="${p.id}">ابدأ جولة 360° ${ic('arrow',16)}</button><a class="btn btn-line btn-sm" href="#place-${p.slug}">التفاصيل</a></div></div></article>`;
}
function ccard(c){
  const n=cntCity[c.slug]||0;
  return `<a class="ccard" href="#city-${c.slug}" style="${bg(cityImg(c))}"><span class="cnt num">${n} وجهة</span><div class="nm"><div><h3>${c.ar}</h3><small>${c.en}</small></div>${ic('diag',22)}</div></a>`;
}
function ktile(c,i){
  const n=cntCat[c.slug]||0;
  return `<a class="ktile" href="#category-${c.slug}"><span class="n">${String(i+1).padStart(2,'0')}</span>${ic(c.icon,22)}<b>${c.ar}</b><small class="num">${n?n+' منشأة':'قريبًا'}</small><span class="chev">${ic('chev',18)}</span></a>`;
}
const sh=(eyebrow,title,linkText,href)=>`<div class="sh"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>${linkText?`<a class="tlink" href="${href}">${linkText} ${ic('arrow',18)}</a>`:''}</div>`;
const demoNote=`<div class="note"><span style="display:inline-flex;align-items:center;gap:10px;color:var(--gold-ink)">${ic('spark',18)}</span><span style="flex:1;min-width:220px">كل بطاقة موسومة «تجريبي» هي مثال توضيحي، وليست توصية أو معلومة مؤكدة عن منشأة فعلية. الصور مرسومة للعرض فقط.</span></div>`;

/* ---------- map provider (swappable) ---------- */
const MapProvider={
  name:'schematic',
  project(items){
    const lat=items.map(p=>p.lat),lng=items.map(p=>p.lng);
    let a=Math.min(...lat),b=Math.max(...lat),c=Math.min(...lng),d=Math.max(...lng);
    if(b-a<.03){a-=.02;b+=.02}if(d-c<.03){c-=.02;d+=.02}
    return p=>({x:8+(p.lng-c)/(d-c)*84,y:10+(1-(p.lat-a)/(b-a))*78});
  },
  html(items,sel,label){
    const pr=this.project(items);
    return items.map(p=>{const q=pr(p);return `<button class="mk${p.tour?' t':''}" data-mk="${p.id}" aria-pressed="${sel===p.id}" aria-label="${esc(p.name)}" style="left:${q.x.toFixed(2)}%;top:${q.y.toFixed(2)}%">${ic('pin',15,2)}</button>`}).join('')
      +`<span class="mlab">${esc(label)} · خريطة تخطيطية</span><span class="mleg"><span class="mk t" style="position:static;transform:none;width:16px;height:16px;border-width:1px"></span> جولة 360° متاحة</span>`;
  }
};

/* ---------- listing engine (filters + sort + grid/map) ---------- */
const LST={};
const MOUNT=[];
function bandOptions(cat){
  const b=cat.priceBands;
  return `<option value="">كل الأسعار</option><option value="0">أقل من ${fmt(b[0])}</option><option value="1">${fmt(b[0])} – ${fmt(b[1])}</option><option value="2">${fmt(b[1])} – ${fmt(b[2])}</option><option value="3">${fmt(b[2])} فأكثر</option>`;
}
const bandIdx=(cat,v)=>{const b=cat.priceBands;return v<b[0]?0:v<b[1]?1:v<b[2]?2:3};
const SORT_FN={
  new:(a,b)=>a.daysAgo-b.daysAgo,
  priceAsc:(a,b)=>(a.price==null)-(b.price==null)||a.price-b.price,
  priceDesc:(a,b)=>(a.price==null)-(b.price==null)||b.price-a.price,
  mostBooked:(a,b)=>b.bookings-a.bookings,
  rating:(a,b)=>b.rating-a.rating||b.views-a.views,
  capacity:(a,b)=>((b.a.guests||b.a.capacity||0)-(a.a.guests||a.a.capacity||0)),
  views:(a,b)=>b.views-a.views
};
function runListing(L){
  const {o,st}=L;
  let r=PLACES.slice();
  if(o.fixedTour)r=r.filter(p=>p.tour);
  if(o.fixedCat)r=r.filter(p=>p.cat===o.fixedCat);
  if(o.fixedCity)r=r.filter(p=>p.city===o.fixedCity);
  if(st.city)r=r.filter(p=>p.city===st.city);
  if(st.cat)r=r.filter(p=>p.cat===st.cat);
  if(st.q){const ids=new Set(searchPlaces(st.q).map(p=>p.id));r=r.filter(p=>ids.has(p.id))}
  if(st.has360)r=r.filter(p=>p.tour);
  if(st.isNew)r=r.filter(p=>p.daysAgo<=30);
  if(st.featured)r=r.filter(p=>p.featured);
  if(st.rating)r=r.filter(p=>p.rating>=Number(st.rating));
  const cat=st.cat?CAT[st.cat]:(o.fixedCat?CAT[o.fixedCat]:null);
  if(st.price!==''&&cat&&cat.priceBands)r=r.filter(p=>p.price!=null&&bandIdx(cat,p.price)===Number(st.price));
  r.sort(SORT_FN[st.sort]||SORT_FN.new);
  return r;
}
function listing(key,o){
  const st=Object.assign({q:'',city:'',cat:'',has360:false,isNew:false,featured:false,price:'',rating:'',sort:'new',view:o.view||'grid',mapCity:'',sel:''},o.init||{});
  LST[key]={o,st};
  const D=f=>`data-l="${key}" data-f="${f}"`;
  const show=o.show||[];
  let bar='<div class="fbar">';
  if(show.includes('q'))bar+=`<input type="search" placeholder="ابحث بالاسم أو الحي أو الخدمة" aria-label="بحث" ${D('q')} value="${esc(st.q)}">`;
  if(show.includes('city'))bar+=`<select aria-label="المدينة" ${D('city')}><option value="">كل المدن</option>${activeCities.map(c=>`<option value="${c.slug}">${c.ar}</option>`).join('')}</select>`;
  if(show.includes('cat'))bar+=`<select aria-label="التصنيف" ${D('cat')}><option value="">كل التصنيفات</option>${CATS.filter(c=>cntCat[c.slug]).map(c=>`<option value="${c.slug}">${c.ar}</option>`).join('')}</select>`;
  if(show.includes('has360'))bar+=`<button class="fchip" ${D('has360')} aria-pressed="false">${ic('cube',16)} جولة 360°</button>`;
  if(show.includes('isNew'))bar+=`<button class="fchip" ${D('isNew')} aria-pressed="false">جديد</button>`;
  if(show.includes('featured'))bar+=`<button class="fchip" ${D('featured')} aria-pressed="false">مميز</button>`;
  bar+=`<select aria-label="نطاق السعر" ${D('price')} hidden></select>`;
  if(show.includes('rating'))bar+=`<select aria-label="التقييم" ${D('rating')}><option value="">كل التقييمات</option><option value="4">4.0 فأكثر</option><option value="4.5">4.5 فأكثر</option></select>`;
  bar+=`<select aria-label="الترتيب" ${D('sort')}></select>`;
  if(show.includes('view'))bar+=`<span class="seg" role="group" aria-label="طريقة العرض"><button ${D('view')} data-v="grid" aria-pressed="true">${ic('grid',16)} شبكة</button><button ${D('view')} data-v="map" aria-pressed="false">${ic('map',16)} خريطة</button></span>`;
  bar+='</div>';
  MOUNT.push(()=>refresh(key));
  return `<div id="L-${key}">${o.tabs?o.tabs(key):''}${bar}<div class="cntline"><span id="cnt-${key}" role="status"></span></div><div id="res-${key}"></div></div>`;
}
function refresh(key){
  const L=LST[key],root=document.getElementById('L-'+key);if(!L||!root)return;
  const {o,st}=L;
  const cat=st.cat?CAT[st.cat]:(o.fixedCat?CAT[o.fixedCat]:null);
  const sorts=cat?cat.sorts:BASIC_SORTS;
  if(!sorts.includes(st.sort))st.sort=sorts[0];
  const sel=root.querySelector('[data-f=sort]');sel.innerHTML=sorts.map(s=>`<option value="${s}">${SORT_LABELS[s]}</option>`).join('');sel.value=st.sort;
  const pr=root.querySelector('[data-f=price]');
  if(cat&&cat.priceBands){pr.hidden=false;pr.innerHTML=bandOptions(cat);pr.value=st.price}else{pr.hidden=true;st.price=''}
  root.querySelectorAll('[data-f]').forEach(el=>{
    const f=el.dataset.f,v=st[f];
    if(el.dataset.v!==undefined)el.setAttribute('aria-pressed',String(String(v)===el.dataset.v));
    else if(el.classList.contains('fchip'))el.setAttribute('aria-pressed',String(!!v));
    else if(el.matches('select')&&f!=='sort'&&f!=='price'){if(el.value!==String(v))el.value=v}
  });
  const items=runListing(L);
  const host=root.querySelector('#res-'+key);
  root.querySelector('#cnt-'+key).textContent=items.length?`${items.length} ${items.length===1?'مكان':'أماكن'}`:'';
  if(!items.length){
    host.innerHTML=`<div class="empty">${ic('compass',34)}<h3>لا توجد نتائج مطابقة</h3><p>جرّب تخفيف الفلاتر أو تغيير كلمة البحث.</p><button class="btn btn-brand btn-sm" data-act="reset" data-id="${key}">إعادة ضبط الفلاتر</button></div>`;return;
  }
  if(st.view==='map')renderMap(host,items,key);
  else host.innerHTML=`<div class="${o.cardFn==='tcard'?'tgrid':'pgrid'}">${items.map(o.cardFn==='tcard'?tcard:pcard).join('')}</div>`;
}
function resetListing(key){
  const L=LST[key];const keep={view:L.st.view};
  Object.assign(L.st,{q:'',city:L.o.init&&L.o.init.city||'',cat:L.o.init&&L.o.init.cat||'',has360:false,isNew:false,featured:false,price:'',rating:'',sort:'new'},keep);
  const q=document.querySelector(`#L-${key} [data-f=q]`);if(q)q.value='';
  refresh(key);
}
function renderMap(host,items,key){
  const L=LST[key],st=L.st;
  const cities=[...new Set(items.map(p=>p.city))];
  if(!cities.includes(st.mapCity))st.mapCity=cities[0];
  const here=items.filter(p=>p.city===st.mapCity);
  if(!here.find(p=>p.id===st.sel))st.sel=here[0].id;
  const selP=PLID[st.sel],c=CITY[st.mapCity];
  const tabs=cities.length>1?`<div class="tabs" role="group" aria-label="مدن الخريطة">${cities.map(x=>`<button data-l="${key}" data-f="mapCity" data-v="${x}" aria-pressed="${x===st.mapCity}">${CITY[x].ar} <small class="num">${items.filter(p=>p.city===x).length}</small></button>`).join('')}</div>`:'';
  host.innerHTML=`${tabs}<div class="maplay"><div class="mapbox" role="group" aria-label="خريطة ${c.ar}">${MapProvider.html(here,st.sel,c.ar)}</div>
  <div class="mside"><div class="msel"><div class="pmeta">${c.ar} · ${CAT[selP.cat].ar}</div><h3 style="font-size:19px">${esc(selP.name)}</h3><div class="pfoot" style="padding:0"><span class="rate num">${ic('star',14)} ${rateTxt(selP)}</span>${priceHTML(selP)}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn-brand btn-sm" href="#place-${selP.slug}">التفاصيل</a>${selP.tour?`<button class="btn btn-line btn-sm" data-act="tour" data-id="${selP.id}">${ic('cube',16)} جولة 360°</button>`:''}</div></div>
  <div class="mlist">${here.map(p=>`<button class="mitem" data-mk="${p.id}" aria-pressed="${p.id===st.sel}"><i style="${bg(img(p,0,200,200))}"></i><span><b>${esc(p.name)}</b><small>${CAT[p.cat].ar} · ${esc(p.district)}</small></span></button>`).join('')}</div></div></div>`;
}

/* ---------- views ---------- */
function viewHome(){
  const featured=(()=>{const f=PLACES.filter(p=>p.featured);const seen=new Set(f.map(p=>p.id));PLACES.filter(p=>p.tour&&!seen.has(p.id)).sort((a,b)=>b.rating-a.rating).forEach(p=>{if(f.length<4)f.push(p)});return f.slice(0,4)})();
  const orbP=featured.find(p=>p.tour)||toursAll[0];
  const homeCats=CATS.filter(c=>c.home).slice(0,12);
  const tours=toursAll.filter(p=>p.featured||p.rating>=4.6).slice(0,3);
  return `
  <section class="hero"><div class="hero-bg" style="${bg(sceneUri('sea',11,1600,900,2))}"></div>
   <div class="wrap">
    <div class="kick">دليلك الرقمي لاكتشاف الأماكن</div>
    <h1>اكتشف المكان <span>قبل ما تروح له</span></h1>
    <p class="sub">استكشف الأماكن والتجارب من حولك، وشاهدها بجولة 360° قبل زيارتها.</p>
    <form class="hsearch" data-form="hsearch" role="search">${ic('search',22)}<input id="hq" type="text" placeholder="ابحث عن مكان أو تجربة أو مدينة…" aria-label="ابحث عن مكان أو تجربة أو مدينة" autocomplete="off"><button class="btn btn-brand" type="submit">${ic('arrow',18)} <span class="t">اكتشف الآن</span></button></form>
    <div class="quick"><a href="#cities">${ic('target',16)} اكتشف أماكن قريبة أو في مدينة أخرى</a><a href="#tours">${ic('cam',16)} شاهد المكان قبل الزيارة</a><a href="#map">${ic('map',16)} تصفح الخريطة</a></div>
    <div class="foot"><button class="orb" data-act="tour" data-id="${orbP.id}" aria-label="ابدأ جولة تجريبية 360"><i>360°</i><span>شاهدها<br>من كل زاوية</span></button><span>مساحة للاكتشاف</span><span class="lat">Discover / 01</span></div>
   </div></section>
  <div class="wrap"><div class="intro"><p>فكرة أوضح عن المكان تبدأ من هنا.<b>اكتشف، شاهد، ثم قرر أين تذهب.</b></p><span class="tag">بيانات العرض تجريبية</span></div></div>
  <section class="sec"><div class="wrap">${sh('اختر وجهتك','مدن تستحق أن تُكتشف','كل المدن','#cities')}<div class="cgrid">${activeCities.map(ccard).join('')}</div></div></section>
  <section class="sec alt"><div class="wrap">${sh('مسارات الاكتشاف','وش ودّك تكتشف؟','كل التصنيفات','#categories')}<div class="kgrid">${homeCats.map(ktile).join('')}</div></div></section>
  <section class="sec"><div class="wrap">${sh('اختيارات جولات 360','أماكن تبدأ منها','اكتشف كل الأماكن','#explore')}<div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${featured.map(pcard).join('')}</div>${demoNote}</div></section>
  <section class="band"><div class="wrap"><div><div class="lat">Jawlat 360°</div><h2>لا تكتفِ بالصورة. <span>ادخل إلى المشهد.</span></h2><p>الجولة الافتراضية تُريك المكان من الداخل: المساحات، المسافات، الإطلالة. السجلات الحالية تجريبية، وتعمل الجولة الكاملة عند ربط موفر معتمد.</p><a class="btn btn-cream" href="#tours">${ic('arrow',18)} استكشف جولات 360</a></div>
   <div class="rings" aria-hidden="true"><i></i><i></i><i></i><span class="dot" style="top:10%;inset-inline-end:12%"></span><span class="dot" style="bottom:22%;inset-inline-start:2%;width:10px;height:10px;background:#7ccbab"></span><div class="ctr"><div><b>360°</b><small>LOOK AROUND</small></div></div><div class="cnt num">${String(toursAll.length).padStart(2,'0')}<small>سجلات جولات Demo</small></div></div></div></section>
  <section class="sec"><div class="wrap">${sh('شاهد قبل الزيارة','جولات 360°','كل الجولات','#tours')}<div class="tgrid">${tours.map(tcard).join('')}</div></div></section>
  <section class="sec alt"><div class="wrap split"><div><div class="eyebrow">مجلة جولات 360</div><h2 style="font-size:clamp(28px,4.4vw,48px);margin:6px 0 14px">حكايات صغيرة عن أماكن كبيرة.</h2><p style="color:var(--muted);margin-bottom:18px">قراءات قصيرة تساعدك على رؤية المدينة من منظور مختلف.</p><a class="tlink" href="#articles">اذهب إلى المجلة ${ic('arrow',18)}</a></div>
   <div class="alist">${ARTICLES.map((a,i)=>articleRow(a,i)).join('')}</div></div></section>
  <section class="sec"><div class="wrap"><div class="cta"><div class="mark">ج<br><span class="lat" style="font-size:11px;letter-spacing:.1em;color:var(--gold-ink)">360</span></div><div class="grow"><div class="eyebrow">شبكة اكتشاف أوسع</div><h2>مكانك يستحق أن يُرى.</h2><p>تعرّف على شبكة شركاء جولات 360، أو أرسل طلب اهتمام للشراكة.</p></div><a class="btn btn-line" href="#partners">${ic('arrow',18)} اكتشف الشركاء</a></div></div></section>`;
}
function articleRow(a,i){
  return `<a class="arow" href="#article-${a.slug}"><span class="n">${String(i+1).padStart(2,'0')}</span><div><small>${CITY[a.city].ar} · مقال تجريبي</small><h3>${a.ar}</h3><p>${a.lead}</p></div>${ic('diag',20)}</a>`;
}
function viewExplore(arg,preset){
  const init=Object.assign({},preset||{});
  return `<div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>اكتشف</span></div><h1 style="font-size:clamp(32px,5vw,56px);font-weight:600">اكتشف الأماكن</h1><p style="color:var(--muted);margin-top:6px">مدينة كاملة في صفحة واحدة: ابحث، صفِّ، وبدّل بين الشبكة والخريطة.</p>
  ${listing('ex',{show:['q','city','cat','has360','isNew','featured','rating','view'],init})}</div><div style="height:48px"></div>`;
}
function viewCities(){
  const soon=CITIES.filter(c=>!c.active);
  return `<section class="phead"><div class="bg" style="${bg(sceneUri('sea',5,1600,700,1))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>المدن</span></div><div class="eyebrow">اختر وجهتك</div><h1>المدن</h1><p>خمس مدن في البداية، والبنية جاهزة لبقية مدن المملكة من لوحة الإدارة في المرحلة 3.</p></div></section>
  <section class="sec"><div class="wrap"><div class="cgrid">${activeCities.map(ccard).join('')}</div>
  <div style="margin-top:44px"><div class="eyebrow">قريبًا</div><h2 style="font-size:28px;margin:6px 0 16px">مدن قادمة</h2><div class="chips">${soon.map(c=>`<span class="cchip">${c.ar}</span>`).join('')}</div></div></div></section>`;
}
function viewCity(slug,preset){
  const c=CITY[slug];if(!c||!c.active)return viewNotFound();
  const reg=REGIONS.find(r=>r.id===c.region);
  const present=CATS.filter(k=>PLACES.some(p=>p.city===slug&&p.cat===k.slug));
  const cnt=k=>PLACES.filter(p=>p.city===slug&&p.cat===k.slug).length;
  const key='ct';
  const tabs=k=>`<div class="tabs" role="group" aria-label="القطاعات في ${c.ar}"><button data-l="${k}" data-f="cat" data-v="" aria-pressed="true">الكل <small class="num">${cntCity[slug]}</small></button>${present.map(x=>`<button data-l="${k}" data-f="cat" data-v="${x.slug}" aria-pressed="false">${ic(x.icon,16)} ${x.ar} <small class="num">${cnt(x)}</small></button>`).join('')}</div>`;
  const best=PLACES.filter(p=>p.city===slug&&p.tour).sort((a,b)=>b.rating-a.rating).slice(0,3);
  return `<section class="phead"><div class="bg" style="${bg(cityImg(c,1600,700))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <a href="#cities">المدن</a> / <span>${c.ar}</span></div><div class="eyebrow lat" style="letter-spacing:.2em">${c.en} · ${reg.ar}</div><h1>${c.ar}</h1><p>${c.about}</p>
   <div class="stats num"><div><b>${cntCity[slug]}</b>وجهة</div><div><b>${cntTour[slug]||0}</b>جولة 360°</div><div><b>${present.length}</b>قطاعات</div></div></div></section>
  <section class="sec" style="padding-top:28px"><div class="wrap">
  ${best.length?`<div class="sh" style="margin-bottom:18px"><div><div class="eyebrow">أفضل الجولات</div><h2 style="font-size:28px">جولات مختارة في ${c.ar}</h2></div></div><div class="tgrid" style="margin-bottom:44px">${best.map(tcard).join('')}</div>`:''}
  <div class="sh" style="margin-bottom:8px"><div><div class="eyebrow">تصفح ${c.ar}</div><h2 style="font-size:28px">الأماكن حسب القطاع</h2></div></div>
  ${listing(key,{fixedCity:slug,show:['q','has360','isNew','featured','rating','view'],tabs,init:Object.assign({city:slug},preset||{})})}</div></section>`;
}
function viewCategories(){
  return `<section class="phead"><div class="bg" style="${bg(sceneUri('city',8,1600,700,0))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>التصنيفات</span></div><div class="eyebrow">مسارات الاكتشاف</div><h1>التصنيفات</h1><p>كل قطاع سجل إعدادات: حقوله وفلاتره وخيارات ترتيبه ونمط التعامل فيه. تُضاف قطاعات جديدة من لوحة الإدارة في المرحلة 3 دون تعديل الواجهة.</p></div></section>
  <section class="sec"><div class="wrap"><div class="kgrid">${CATS.map(ktile).join('')}</div></div></section>`;
}
function viewCategory(slug,preset){
  const c=CAT[slug];if(!c)return viewNotFound();
  const n=cntCat[slug]||0;
  return `<section class="phead"><div class="bg" style="${bg(sceneUri(c.scene,hash(slug)%991,1600,700,3))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <a href="#categories">التصنيفات</a> / <span>${c.ar}</span></div><div class="eyebrow lat" style="letter-spacing:.2em">${c.en}</div><h1>${c.ar}</h1><p>${c.desc}</p><div class="stats num"><div><b>${n}</b>منشأة</div><div><b>${PLACES.filter(p=>p.cat===slug&&p.tour).length}</b>جولة 360°</div></div></div></section>
  <section class="sec" style="padding-top:20px"><div class="wrap">${n?listing('cg',{fixedCat:slug,show:['q','city','has360','isNew','featured','rating','view'],init:Object.assign({cat:slug},preset||{})}):`<div class="empty">${ic(c.icon,38)}<h3>لا توجد أماكن في هذا التصنيف بعد</h3><p>التصنيف جاهز في النظام، وتظهر أماكنه هنا عند إضافتها.</p><a class="btn btn-brand btn-sm" href="#explore">اكتشف كل الأماكن</a></div>`}</div></section>`;
}
function copyRow(icon,label,val){return `<div class="crow">${ic(icon,20)}<span><small>${label}</small><bdi class="num">${esc(val)}</bdi></span><button class="copybtn" data-act="copy" data-text="${esc(val)}">نسخ</button></div>`}
function viewPlace(slug){
  const p=PL[slug];if(!p)return viewNotFound();
  MOUNT.push(()=>fillParts(p.id));
  const c=CAT[p.cat],ci=CITY[p.city];
  const rows=c.fields.filter(f=>p.a[f.k]!==undefined&&p.a[f.k]!==null).map(f=>{
    let v=p.a[f.k];
    if(f.t==='bool')v=v?'متوفر':'غير متوفر';
    else if(f.t==='price')v=`${fmt(v)} ر.س${f.u?' '+f.u:''}`;
    else if(f.t==='num')v=`${v}${f.u?' '+f.u:''}`;
    return `<div><dt>${f.l}</dt><dd class="num">${esc(v)}</dd></div>`}).join('');
  const related=PLACES.filter(x=>x.id!==p.id&&x.cat===p.cat).sort((a,b)=>(b.city===p.city)-(a.city===p.city)||b.rating-a.rating).slice(0,3);
  const shareUrl=(()=>{try{return PATHMODE?siteUrl()+rawToHref('place-'+p.slug):location.href}catch(e){return ''}})();
  return `<div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <a href="#city-${ci.slug}">${ci.ar}</a> / <a href="#category-${c.slug}">${c.ar}</a> / <span>${esc(p.name)}</span></div>
  <div class="ptitle"><div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${p.tour?`<span class="bd bd-tour">${ic('cube',13)} جولة 360° متاحة</span>`:''}${p.featured?'<span class="bd bd-pick">اختيار جولات</span>':''}${verOk(p.id)?`<span class="bd bd-ok">${ic('check',13)} تم التحقق</span>`:''}${isDemo(p)?'<span class="bd bd-demo">تجريبي</span>':''}</div>
   <h1>${esc(p.name)}</h1><div class="meta"><span>${ic(c.icon,16)} ${c.ar}</span><span>${ic('pin',16)} حي ${esc(p.district)}، ${ci.ar}</span><span class="rate num">${ic('star',15)} ${rateTxt(p)}${p.reviewCount?` <small style="color:var(--muted);font-weight:400">(${p.reviewCount} تقييم)</small>`:''} <small style="color:var(--muted);font-weight:400">${isDemo(p)?'(تقييم تجريبي)':p.rating?'':'(لا تقييمات بعد)'}</small></span></div></div>
   <div style="display:flex;gap:10px;flex-wrap:wrap">${p.tour?`<button class="btn btn-brand" data-act="tour" data-id="${p.id}">${ic('cube',18)} ابدأ جولة 360°</button>`:''}<button class="btn btn-line" data-act="showmap" data-id="${p.id}">${ic('pin',18)} عرض الموقع</button><span id="bkcta" class="ctas"></span></div></div>
  <div class="gal"><div class="main" id="gmain" style="${bg(img(p,0,1200,900))}" role="img" aria-label="صورة توضيحية"></div><div class="ths">${[0,1,2,3,4].slice(0,4).map(k=>`<button class="th" data-act="gal" data-k="${k}" data-id="${p.id}" aria-pressed="${k===0}" style="${bg(img(p,k,400,300))}" aria-label="صورة ${k+1}"></button>`).join('')}</div></div>
  <p class="cap">صور توضيحية مرسومة للعرض، وليست صور منشأة حقيقية.</p>
  ${p.tour?`<div class="tourcard" style="${bg(img(p,3,1400,600))}"><div class="in"><span class="bd bd-tour" style="width:fit-content">${ic('cube',13)} جولة 360°</span><h2>ادخل المكان قبل أن تزوره</h2><p>${p.tour.embedUrl?'جولة تفاعلية كاملة: اسحب للدوران وتنقّل بين النقاط داخل الجولة.':'معاينة تجريبية بمشغّل بسيط: اسحب للدوران، قرّب وبعّد، وانتقل بين النقاط.'}</p><div><button class="btn btn-cream" data-act="tour" data-id="${p.id}">${ic('arrow',18)} ابدأ جولة 360°</button></div></div></div>`
   :`<div class="card" style="margin-top:22px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:space-between"><div><h2 style="margin:0 0 4px;font-size:20px">لا توجد جولة 360° لهذا السجل بعد</h2><p style="color:var(--muted);font-size:14px">يظهر زر الجولة تلقائيًا عند ربط جولة بالمنشأة.</p></div><button class="btn btn-line btn-sm" disabled>طلب تصوير — متاح قريبًا</button></div>`}
  <div class="pcols"><div class="stack">
    <div class="card"><h2>عن المكان</h2><p style="color:var(--muted)">${esc(p.desc)}</p></div>
    ${placeParts(p)}
    ${rows?`<div class="card"><h2>التفاصيل</h2><dl class="spec" style="margin:0">${rows}</dl></div>`:''}
    ${p.amen.length?`<div class="card"><h2>الخدمات والمرافق</h2><div class="tags">${p.amen.map(a=>`<span>${esc(a)}</span>`).join('')}</div></div>`:''}
    ${p.hours?`<div class="card"><h2>ساعات العمل</h2><div class="crow" style="border:0;padding:0">${ic('clock',20)}<span>${esc(p.hours)}</span></div></div>`:''}
    <div class="card"><h2>الموقع</h2><p style="color:var(--muted);margin-bottom:14px">${ic('pin',16)} حي ${esc(p.district)}، ${ci.ar} <small>${isDemo(p)?'(عنوان تجريبي)':p.approxLoc?'(موضع تقريبي على الخريطة)':''}</small></p><div class="mapbox mini" role="group" aria-label="موقع المكان">${MapProvider.html([p],p.id,ci.ar)}</div><div style="margin-top:14px"><button class="btn btn-line btn-sm" data-act="showmap" data-id="${p.id}">${ic('map',16)} افتح الخريطة</button></div></div>
    <div class="demo-note">${ic('spark',20)}<span>${isDemo(p)?'هذا سجل تجريبي. لا تُمنح شارات التوثيق إلا بعد مراجعة الجودة من الإدارة، والتقييمات الحقيقية تبدأ مع نظام المراجعات (المرحلة 4).':'أدخل صاحب المنشأة بيانات هذه الصفحة ووافقت الإدارة على نشرها. لا تظهر شارة «تم التحقق» إلا باكتمال بنود التحقق.'}</span></div>
  </div>
  <aside class="sidecol">${isDemo(p)?'':`<div class="card" id="bk" data-pid="${p.id}"></div>`}<div class="card">${p.price!=null?`<div class="priceblk num">${/^تبدأ/.test(p.unit)?'تبدأ من ':''}${fmt(p.price)} <small>ر.س ${/^تبدأ/.test(p.unit)?'':esc(p.unit)}</small></div><p class="cap" style="margin:2px 0 14px">${isDemo(p)?'سعر تجريبي للعرض':'السعر كما أدخله صاحب المنشأة'}</p>`:''}
    <h2 style="font-size:19px;margin-bottom:6px">التواصل</h2>${p.phone?copyRow('phone','الهاتف',p.phone):''}${p.wa?copyRow('chat','واتساب',p.wa):''}${p.site?copyRow('globe','الموقع الإلكتروني',p.site):''}${p.social?copyRow('user','حساب التواصل',p.social):''}${isDemo(p)?'<p class="cap">أرقام وروابط تجريبية.</p>':''}</div>
   ${verCard(p)}${qrCard(p)}${isDemo(p)?'':`<div class="card"><button class="btn btn-line btn-sm" data-act="cp-place" data-id="${p.id}">إبلاغ عن مشكلة في هذه الصفحة</button></div>`}<div class="card"><h2 style="font-size:19px">مشاركة</h2><div class="acts2"><a class="btn btn-line btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(p.name+' — جولات 360 '+shareUrl)}">${ic('share',16)} مشاركة عبر واتساب</a><button class="btn btn-line btn-sm" data-act="copy" data-text="${esc(shareUrl)}" data-toast="تم نسخ الرابط">${ic('link',16)} نسخ الرابط</button></div></div></aside></div>
  ${related.length?`<div style="margin-top:56px">${sh('أماكن مشابهة','مزيد من '+c.ar,'عرض الكل','#category-'+c.slug)}<div class="pgrid">${related.map(pcard).join('')}</div></div>`:''}
  <div style="height:56px"></div></div>`;
}
function viewTours(){
  const tabs=k=>`<div class="tabs" role="group" aria-label="مدن الجولات"><button data-l="${k}" data-f="city" data-v="" aria-pressed="true">كل المدن <small class="num">${toursAll.length}</small></button>${activeCities.filter(c=>cntTour[c.slug]).map(c=>`<button data-l="${k}" data-f="city" data-v="${c.slug}" aria-pressed="false">${c.ar} <small class="num">${cntTour[c.slug]}</small></button>`).join('')}</div>`;
  return `<section class="phead"><div class="bg" style="${bg(sceneUri('pool',21,1600,700,2))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>جولات 360</span></div><div class="eyebrow">شاهد قبل الزيارة</div><h1>جولات 360°</h1><p>كل سجل هنا يملك جولة. المشغّل الحالي معاينة تجريبية بمشاهد مرسومة.</p></div></section>
  <section class="sec" style="padding-top:20px"><div class="wrap">${listing('tr',{fixedTour:true,cardFn:'tcard',show:['q','cat','isNew','featured'],tabs})}</div></section>`;
}
function viewMap(arg,preset){
  const init=Object.assign({city:'dammam',view:'map'},preset||{});
  return `<div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>الخريطة</span></div><h1 style="font-size:clamp(32px,5vw,56px);font-weight:600">خريطة الأماكن</h1><p style="color:var(--muted);margin-top:6px">خريطة تخطيطية بإحداثيات توضيحية. يُستبدل بها مزود خرائط معتمد دون تغيير بقية الصفحة.</p>
  ${listing('mp',{show:['city','cat','has360','rating'],view:'map',init,fixedMap:true})}</div><div style="height:48px"></div>`;
}
function viewArticles(){
  return `<section class="phead"><div class="bg" style="${bg(sceneUri('garden',31,1600,600,1))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>المقالات</span></div><div class="eyebrow">مجلة جولات 360</div><h1>حكايات صغيرة عن أماكن كبيرة</h1><p>مقالات تجريبية توضح أسلوب الدليل. صفحات SEO الكاملة تأتي في المرحلة 6.</p></div></section>
  <section class="sec"><div class="wrap"><div class="alist" style="max-width:820px">${ARTICLES.map(articleRow).join('')}</div></div></section>`;
}
function viewArticle(slug){
  const a=ARTICLES.find(x=>x.slug===slug);if(!a)return viewNotFound();
  return `<div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <a href="#articles">المقالات</a> / <span>${a.ar}</span></div><article class="prose" style="padding-bottom:64px"><span class="tag">${CITY[a.city].ar} · مقال تجريبي</span><h1 style="margin-top:14px">${a.ar}</h1><p style="color:var(--muted)">${a.lead}</p>${a.body.map(t=>`<p>${t}</p>`).join('')}<a class="tlink" href="#articles">${ic('arrow',18)} كل المقالات</a></article></div>`;
}
function viewPartners(){
  MOUNT.push(fillPartners);
  return `<section class="phead"><div class="bg" style="${bg(sceneUri('city',44,1600,600,0))}"></div><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>الشركاء</span></div><div class="eyebrow">شبكة اكتشاف أوسع</div><h1>شركاء جولات 360</h1><p>قدّم طلب شراكة أو سجّل كسفير وانشر رابطك. لا يظهر أي اسم شريك قبل اعتماده من الإدارة.</p></div></section>
  <section class="sec"><div class="wrap"><div class="kgrid">${PARTNER_TYPES.map(([t,d],i)=>`<div class="ktile" style="align-items:flex-start"><span class="n">${String(i+1).padStart(2,'0')}</span><div style="flex:1"><b style="display:block">${t}</b><small>${d}</small></div></div>`).join('')}</div>
  </div></section><section class="sec" style="padding-top:0"><div class="wrap" id="pt"></div></section>`;
}
function viewNotFound(){
  return `<div class="wrap" style="padding-block:96px;text-align:center"><div class="empty">${ic('compass',40)}<h3>لم نجد هذه الصفحة</h3><p>ربما تغيّر الرابط. ابدأ من الاستكشاف.</p><a class="btn btn-brand btn-sm" href="#explore">اكتشف الأماكن</a></div></div>`;
}

/* ---------- chrome ---------- */
const NAV=[['home','الرئيسية'],['explore','اكتشف'],['tours','جولات 360'],['cities','المدن'],['categories','التصنيفات'],['articles','المقالات'],['partners','شركاء جولات 360']];
const SECT={home:'home',explore:'explore',place:'explore',map:'map',tours:'tours',cities:'cities',city:'cities',categories:'categories',category:'categories',articles:'articles',article:'articles',partners:'partners'};
function chrome(name,main){
  const cur=SECT[name];
  const navA=(cls)=>NAV.map(([k,t])=>`<a href="#${k}"${cur===k?' aria-current="page"':''}>${t}</a>`).join('');
  return `<a class="skip" href="#main">تخطي إلى المحتوى</a><header class="hdr"><div class="wrap"><a class="logo" href="#home" aria-label="جولات 360 — الرئيسية">${logoMark(38)}<span><b>جولات 360</b><small>JAWLAT 360</small></span></a>
   <nav class="nav" aria-label="التنقل الرئيسي">${navA()}</nav>
   <div class="hdr-end"><button class="spill" data-act="search">${ic('search',18)} ابحث عن مكان</button><button class="iconbtn" data-act="search" aria-label="بحث">${ic('search',20)}</button>${ACC.uid?`<a class="btn btn-line btn-sm hbtn" href="#bookings">حجوزاتي</a>`:''}${CAN===true?`<a class="btn btn-line btn-sm hbtn" href="#account">لوحة المالك</a>`:''}${window.JW_AUTH?(JW_AUTH.signedIn()?`<button class="btn btn-line btn-sm hbtn" data-act="logout" title="${esc(JW_AUTH.email())}">خروج</button>`:`<button class="btn btn-brand btn-sm hbtn" data-act="login">دخول</button>`):''}<button class="iconbtn" data-act="menu" aria-label="القائمة">${ic('menu',20)}</button></div></div></header>
  <main id="main">${main}</main>
  <footer class="ftr"><div class="wrap"><div class="cols">
   <div><a class="logo" href="#home">${logoMark(38)}<span><b>جولات 360</b><small>JAWLAT 360</small></span></a><p style="margin-top:12px;font-size:14px">دليل رقمي لاكتشاف الوجهات والتجارب في السعودية.</p><div class="tagl">${ic('compass',16)} اكتشف. شاهد. قرر.</div></div>
   <div><h4>اكتشف</h4><a href="#explore">كل الأماكن</a><a href="#cities">المدن</a><a href="#tours">جولات 360</a><a href="#map">الخريطة</a></div>
   <div><h4>المجلة</h4><a href="#articles">المقالات</a><a href="#partners">الشركاء</a><a href="#partners">كن شريكًا</a></div>
   <div><h4>JAWLAT 360</h4><p style="font-size:14px;color:#cbd5ce">اكتشف المكان قبل ما تروح له.</p></div></div>
   <div class="copy"><span>© 2026 جولات 360</span><span>البيانات الموسومة «تجريبي» مخصصة للعرض فقط. · <a href="#offers" style="opacity:.8">العروض</a> · <a href="#partners" style="opacity:.8">الشركاء والسفراء</a> · <a href="#account" style="opacity:.8">حسابي</a> · <a href="#admin" style="opacity:.8">لوحة الإدارة</a></span></div></div></footer>
  <nav class="bnav" aria-label="تنقل الجوال">${[['home','الرئيسية','home'],['explore','استكشف','search'],['map','الخريطة','map'],['tours','الجولات','cube'],['cities','المدن','pin']].map(([k,t,i])=>`<a href="#${k}"${cur===k?' aria-current="page"':''}>${ic(i,22)}<span>${t}</span></a>`).join('')}</nav>`;
}

/* ---------- overlays ---------- */
function closeOverlays(){app.querySelectorAll('.sov,.drawer,.tv').forEach(n=>{if(n._close)n._close();else n.remove()});document.body.style.overflow=''}
function openSearch(){
  closeOverlays();
  const el=document.createElement('div');el.className='sov';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','بحث');
  el.innerHTML=`<div class="box"><form class="in" data-form="osearch">${ic('search',20)}<input id="oq" type="text" placeholder="اسم المكان أو المدينة أو التصنيف" aria-label="بحث" autocomplete="off"><button type="button" class="iconbtn" style="display:inline-flex;width:38px;height:38px" data-act="closeov" aria-label="إغلاق">${ic('close',18)}</button></form><div class="res" id="ores"><div class="hint">اكتب للبحث في ${PLACES.length} سجلًا تجريبيًا.</div></div></div>`;
  el.addEventListener('click',e=>{if(e.target===el)closeOverlays()});
  app.appendChild(el);document.body.style.overflow='hidden';$('#oq',el).focus();
}
function updateOverlaySearch(q){
  const host=$('#ores');if(!host)return;
  if(!norm(q)){host.innerHTML=`<div class="hint">اكتب للبحث في ${PLACES.length} سجلًا تجريبيًا.</div>`;return}
  const r=searchPlaces(q);
  host.innerHTML=r.length?r.slice(0,8).map(p=>`<a href="#place-${p.slug}"><i style="${bg(img(p,0,160,160))}"></i><span><b>${esc(p.name)}</b><br><small>${CITY[p.city].ar} · ${CAT[p.cat].ar}</small></span></a>`).join('')+(r.length>8?`<div class="hint">و${r.length-8} نتيجة أخرى. اضغط Enter لعرضها كلها.</div>`:`<div class="hint">اضغط Enter لعرض النتائج في صفحة الاستكشاف.</div>`):`<div class="hint">لا توجد نتائج لـ «${esc(q)}».</div>`;
}
function openDrawer(cur){
  closeOverlays();
  const el=document.createElement('div');el.className='drawer';
  el.innerHTML=`<nav aria-label="القائمة"><button class="iconbtn dx" style="display:inline-flex" data-act="closeov" aria-label="إغلاق">${ic('close',20)}</button>${NAV.map(([k,t])=>`<a href="#${k}"${cur===k?' aria-current="page"':''}>${t}</a>`).join('')}<a href="#map">الخريطة</a>${ACC.uid?'<a href="#bookings">حجوزاتي</a>':''}${CAN===true?'<a href="#account">لوحة المالك</a><a href="#admin">إدارة الجولات</a>':''}${window.JW_AUTH&&!JW_AUTH.signedIn()?'<button class="btn btn-brand btn-sm" data-act="login" style="margin:10px 18px">دخول / إنشاء حساب</button>':''}</nav>`;
  el.addEventListener('click',e=>{if(e.target===el||e.target.closest('a'))closeOverlays()});
  app.appendChild(el);
}
function toast(msg){
  let t=$('.toast',app);if(t)t.remove();
  t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.innerHTML=`<span>${esc(msg)}</span>`;app.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}
function copyText(text,msg){
  const ok=()=>toast(msg||'تم النسخ');
  const fb=()=>{try{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();const r=document.execCommand('copy');ta.remove();r?ok():toast('حدّد النص وانسخه يدويًا')}catch(e){toast('حدّد النص وانسخه يدويًا')}};
  try{navigator.clipboard.writeText(text).then(ok,fb)}catch(e){fb()}
}
const TOUR_POINTS={pool:['المدخل','المجلس','المسبح','الجلسة الخارجية'],sea:['المدخل','الإطلالة','الممشى'],city:['الاستقبال','الواجهة','المبنى'],interior:['المدخل','الجلسات','الركن الخاص','الواجهة'],dunes:['المدخل','الساحة','المعلم'],garden:['المدخل','الساحة','الحديقة']};
const TOUR_KIND={0:null,1:'garden',2:'interior',3:'pool'};
function openTour(id){
  const p=PLID[id];if(!p||!p.tour)return;Analytics.track('tour',id);
  closeOverlays();
  if(p.tour.embedUrl)return openEmbed(p);
  const c=CAT[p.cat],pts=TOUR_POINTS[c.scene]||TOUR_POINTS.garden;
  let idx=0,x=0,zoom=1,dragging=false,last=0,auto=!reduced,raf=0;
  const el=document.createElement('div');el.className='tv';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','جولة 360 — '+p.name);
  el.innerHTML=`<div class="tv-top"><b>${esc(p.name)} <small style="opacity:.7">· معاينة تجريبية</small></b><button data-tv="full" aria-label="ملء الشاشة">${ic('expand',20)}</button><button data-tv="close" aria-label="إغلاق">${ic('close',20)}</button></div>
  <div class="tv-view" id="tvv" tabindex="0" aria-label="اسحب لتدوير المشهد"><span class="tv-name" id="tvn"></span><span class="tv-note">اسحب للدوران · عجلة الفأرة أو الأزرار للتقريب · المشغّل الكامل في المرحلة 2</span></div>
  <div class="tv-hud"><div class="tv-pts" role="group" aria-label="نقاط الجولة">${pts.map((n,i)=>`<button data-tv="pt" data-i="${i}" aria-pressed="${i===0}">${n}</button>`).join('')}</div><div class="tv-zoom"><button data-tv="zout" aria-label="تبعيد">${ic('minus',20)}</button><button data-tv="zin" aria-label="تقريب">${ic('plus',20)}</button></div></div>`;
  app.appendChild(el);document.body.style.overflow='hidden';
  const view=$('#tvv',el);
  const paint=()=>{view.style.backgroundSize=`auto ${view.clientHeight*zoom}px`;view.style.backgroundPosition=`${x}px 50%`};
  const setPt=i=>{idx=i;view.style.backgroundImage=`url("${panoUri(TOUR_KIND[i]||c.scene,p.seed+i*53,(p.seed+i)%PALS.length)}")`;$('#tvn',el).textContent=pts[i];el.querySelectorAll('[data-tv=pt]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.i===i)));paint()};
  const loop=()=>{if(auto&&!dragging){x-=.35;paint()}raf=requestAnimationFrame(loop)};
  view.addEventListener('pointerdown',e=>{dragging=true;auto=false;last=e.clientX;view.classList.add('drag');try{view.setPointerCapture(e.pointerId)}catch(_){}});
  view.addEventListener('pointermove',e=>{if(!dragging)return;x+=e.clientX-last;last=e.clientX;paint()});
  const up=()=>{dragging=false;view.classList.remove('drag')};
  view.addEventListener('pointerup',up);view.addEventListener('pointercancel',up);
  view.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.min(2.6,Math.max(1,zoom-e.deltaY*.0015));paint()},{passive:false});
  view.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){x+=40;auto=false;paint()}if(e.key==='ArrowRight'){x-=40;auto=false;paint()}});
  window.addEventListener('resize',paint);
  el._act=(a,t)=>{
    if(a==='close')closeOverlays();
    else if(a==='zin'){zoom=Math.min(2.6,zoom+.25);paint()}
    else if(a==='zout'){zoom=Math.max(1,zoom-.25);paint()}
    else if(a==='pt')setPt(+t.dataset.i);
    else if(a==='full'){try{(document.fullscreenElement?document.exitFullscreen():el.requestFullscreen()).catch(()=>toast('ملء الشاشة غير متاح هنا'))}catch(_){toast('ملء الشاشة غير متاح هنا')}}
  };
  el._close=()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',paint);try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}el.remove();document.body.style.overflow=''};
  setPt(0);if(!reduced)raf=requestAnimationFrame(loop);
  view.focus({preventScroll:true});
}


/* ---------- embedded tours (WebView / iframe) ---------- */
function openEmbed(p){
  closeOverlays();
  const t=p.tour,url=t.embedUrl;
  if(!okEmbed(url)){toast('رابط الجولة غير مسموح');return}
  const el=document.createElement('div');el.className='tv tv-embed';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','جولة 360 — '+p.name);
  el.innerHTML=`<div class="tv-top"><b>${esc(p.name)} <small style="opacity:.7">· ${esc(TourProviders[t.provider]?TourProviders[t.provider].label:t.provider)}</small></b><button data-tv="full" aria-label="ملء الشاشة">${ic('expand',20)}</button><button data-tv="close" aria-label="إغلاق">${ic('close',20)}</button></div>
  <div class="tv-frame"><div class="tv-load" id="tvl">جارٍ تحميل الجولة…</div><iframe id="tvf" title="جولة 360 — ${esc(p.name)}" src="${esc(url)}" allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer; autoplay" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  <div class="tv-fb">لا تظهر الجولة؟ <a href="${esc(url)}" target="_blank" rel="noopener">افتحها في نافذة جديدة ↗</a></div>`;
  app.appendChild(el);document.body.style.overflow='hidden';
  const f=$('#tvf',el);f.addEventListener('load',()=>{const l=$('#tvl',el);if(l)l.remove()});
  setTimeout(()=>{const l=$('#tvl',el);if(l)l.innerHTML='تعذّر عرض الجولة داخل هذه المعاينة. استخدم رابط «افتحها في نافذة جديدة» بالأسفل.'},7000);
  el._act=(a)=>{if(a==='close')closeOverlays();else if(a==='full'){try{(document.fullscreenElement?document.exitFullscreen():el.requestFullscreen()).catch(()=>toast('ملء الشاشة غير متاح هنا'))}catch(_){toast('ملء الشاشة غير متاح هنا')}}};
  el._close=()=>{try{if(document.fullscreenElement)document.exitFullscreen()}catch(_){}el.remove();document.body.style.overflow=''};
}

const EMBED_HOSTS=['kuula.co','my.matterport.com'];
const okEmbed=u=>{try{const x=new URL(u);return x.protocol==='https:'&&EMBED_HOSTS.some(h=>x.hostname===h||x.hostname.endsWith('.'+h))}catch(e){return false}};
/* TourProvider registry: add a provider here (label + parse) and the dashboard accepts it — no other code changes */
const TourProviders={
  kuula:{label:'Kuula',hint:'الصق رابط المشاركة أو كود التضمين (iframe) من Kuula',
    parse(raw){
      const m=raw.match(/kuula\.co\/(share|post)\/(collection\/)?([A-Za-z0-9_-]{4,})([^\s"'<>]*)/i);
      if(!m)return {error:'لم أجد رابط Kuula صالحًا. المطلوب رابط يشبه kuula.co/share/XXXXXX أو kuula.co/post/XXXXXX أو كود iframe كامل.'};
      const col=m[2]?'collection/':'',id=m[3];
      let q=m[4]||'';if(q[0]!=='?')q='';
      if(!q)q='?fs=1&vr=1&sd=1&gyro=1&logo=0&info=0&thumbs=1';
      return {tourId:id,embedUrl:`https://kuula.co/share/${col}${id}${q.replace(/&amp;/g,'&')}`};
    }},
  custom:{label:'رابط تضمين آخر (https)',hint:'الصق رابط جولة Matterport (my.matterport.com). المواقع الأخرى غير مسموحة لأسباب أمنية',
    parse(raw){
      const m=raw.match(/https:\/\/[^\s"'<>]+/i);
      if(!m)return {error:'الرابط يجب أن يبدأ بـ https://'};
      let u=m[0].replace(/&amp;/g,'&');if(!okEmbed(u))return {error:'الرابط غير مسموح. المسموح: Kuula وMatterport فقط.'};try{const x=new URL(u);return {tourId:x.hostname+x.pathname.slice(0,40),embedUrl:x.href}}catch(_){return {error:'الرابط غير صالح.'}}
    }}
};


/* ---------- verification (record state only) + QR ---------- */
const VERIFY_ITEMS=[['loc','الموقع على الخريطة مطابق للواقع'],['photos','الصور والبيانات الأساسية مطابقة'],['tour','الجولة 360° تعمل وتخص هذا المكان'],['hours','ساعات العمل ووسيلة التواصل صحيحة'],['owner','موافقة المالك على النشر']];
let VER={},SET={};
function verOk(id){const v=VER[id];return !!(v&&v.items&&VERIFY_ITEMS.every(([k])=>v.items[k]))}
function fmtDate(iso){try{return new Date(iso).toLocaleDateString('ar-SA-u-nu-latn',{year:'numeric',month:'long',day:'numeric'})}catch(e){return ''}}
function verCard(p){
  const v=VER[p.id]||{},ok=verOk(p.id);
  return `<div class="card"><h2 style="font-size:19px">حالة التحقق</h2><ul class="verlist">${VERIFY_ITEMS.map(([k,t])=>`<li class="${v.items&&v.items[k]?'on':''}"><i>${v.items&&v.items[k]?ic('check',14,2.4):''}</i>${t}</li>`).join('')}</ul><p class="cap">${ok?`اكتملت مراجعة الإدارة${v.verifiedAt?' بتاريخ '+esc(fmtDate(v.verifiedAt)):''}.`:'لم تكتمل مراجعة التحقق بعد. لا تظهر شارة «تم التحقق» إلا باكتمال البنود كلها في سجل المكان.'}</p></div>`;
}
function qrBase(){return (SET.baseUrl||'').trim().replace(/\/+$/,'')||(()=>{try{return PATHMODE?siteUrl():location.href.split('#')[0]}catch(e){return ''}})()}
function qrUrl(kind,id){const raw='go-'+kind+'-'+id;return PATHMODE?qrBase()+rawToHref(raw):qrBase()+'#'+raw}
function qrBlock(kind,p,label){
  const u=qrUrl(kind,p.id),s=QR.svg(u,168);
  return `<figure class="qrf"><div class="qrbox">${s||'<small>الرابط أطول من سعة الرمز</small>'}</div><figcaption><b>${label}</b><bdi class="num qru">${esc(u)}</bdi><span class="qra"><button class="btn btn-line btn-sm" data-act="copy" data-text="${esc(u)}">نسخ الرابط</button>${s?`<button class="btn btn-line btn-sm" data-act="qr-dl" data-kind="${kind}" data-id="${p.id}">تنزيل SVG</button>`:''}</span></figcaption></figure>`;
}
function qrCard(p){
  return `<div class="card"><h2 style="font-size:19px">رموز QR</h2>${qrBlock('property',p,'صفحة المكان')}${p.tour?qrBlock('tour',p,'الجولة 360°'):''}<p class="cap">رمز كل عرض يظهر مع العرض نفسه.${SET.baseUrl?'':' الرابط الحالي مؤقت للمعاينة؛ اضبط الرابط العام من لوحة الإدارة قبل الطباعة.'}</p></div>`;
}
const ui2={pendingTour:null};
function viewGo(arg){
  const m=arg.match(/^(property|tour|offer|camp|ref)-(.+)$/);let p=m&&PLID[m[2]];
  if(m&&m[1]==='ref'){trackOnce('go-'+arg,'ref',m[2]);setSrc('ref',m[2]);MOUNT.push(()=>navTo('home',true));return `<section class="sec"><div class="wrap"><p style="text-align:center;color:var(--muted)">جارٍ الفتح…</p></div></section>`}
  if(m&&m[1]==='camp'){
    const c=(SETD.campaigns.items||{})[m[2]];
    if(!c)return `<section class="sec"><div class="wrap"><div class="empty"><h3>${DBREADY?'الحملة غير موجودة':'جارٍ التحميل…'}</h3><a class="btn btn-brand btn-sm" href="#home">الرئيسية</a></div></div></section>`;
    const live=c.active&&c.from<=todayISO()&&todayISO()<=c.to;if(live){trackOnce('go-'+arg,'camp',m[2]);setSrc('camp',m[2])}trackOnce('go-q-'+arg,'qr','');
    let dest='#home';
    if(c.kind==='property'||c.kind==='tour'){const t=PLID[c.target];if(t){dest='#place-'+t.slug;if(c.kind==='tour')ui2.pendingTour=t.id}}
    else if(c.kind==='offer'){const o=offersAll(true).find(x=>x.id===c.target);if(o&&PLID[o.pid])dest='#place-'+PLID[o.pid].slug}
    else if(c.kind==='city'&&CITY[c.target])dest='#city-'+c.target;else if(c.kind==='category'&&CAT[c.target])dest='#category-'+c.target;
    MOUNT.push(()=>navTo(dest.slice(1),true));return `<section class="sec"><div class="wrap"><p style="text-align:center;color:var(--muted)">جارٍ الفتح…</p></div></section>`}
  if(m&&m[1]==='offer'){const o=offersAll(true).find(x=>x.id===m[2]);p=o&&PLID[o.pid];if(!p)return `<section class="sec"><div class="wrap"><div class="empty"><h3>${DBREADY?'العرض غير موجود أو انتهى':'جارٍ التحميل…'}</h3><p>${DBREADY?'قد يكون صاحب المنشأة أزال العرض.':''}</p><a class="btn btn-brand btn-sm" href="#offers">كل العروض</a></div></div></section>`}
  if(!p)return `<section class="sec"><div class="wrap"><div class="empty"><h3>الرابط غير صالح</h3><p>لم نجد المكان المطلوب.</p><a class="btn btn-brand btn-sm" href="#home">العودة للرئيسية</a></div></div></section>`;
  trackOnce('go-'+arg,'qr','');
  if(m[1]==='tour')ui2.pendingTour=p.id;
  MOUNT.push(()=>navTo('place-'+p.slug,true));
  return `<section class="sec"><div class="wrap"><p style="text-align:center;color:var(--muted)">جارٍ فتح ${esc(p.name)}…</p></div></section>`;
}
function tryPending(){const id=ui2.pendingTour;if(id&&PLID[id]&&PLID[id].tour&&app.querySelector('.gal')){ui2.pendingTour=null;openTour(id)}}

/* ---------- persistence: shared db (tours/{placeId}) ---------- */
let DB=null,CAN=null,TOURS={},tourSig='';
function applyTours(){
  PLACES.forEach(p=>{
    if(!('_t0' in p))p._t0=p.tour;
    const s=TOURS[p.id];
    p.tour=s&&s.embedUrl?{provider:s.provider||'kuula',embedUrl:s.embedUrl,thumbnail:s.thumbnail||null,id:s.tourId||''}:p._t0;
  });
  derive();
}
let allSig='',LIVE={},PRICING={monthly:250,yearly:3000,commission:5};
function listingToPlace(r){
  const c=CAT[r.cat],ci=CITY[r.city];if(!c||!ci||!r.id||!r.name)return null;
  const seed=hash(r.id)%9973,ok=typeof r.lat==='number'&&typeof r.lng==='number';
  const t=Date.parse(r.publishedAt||r.createdAt||'')||Date.now();
  const p={id:r.id,slug:'x-'+r.id,cat:r.cat,city:r.city,district:r.district||'',name:r.name,en:r.en||'',a:r.a||{},price:typeof r.price==='number'?r.price:null,unit:r.unit||'',rating:0,daysAgo:Math.max(0,Math.floor((Date.now()-t)/864e5)),bookings:0,views:0,featured:false,status:'published',demo:false,
    lat:ok?r.lat:ci.lat+((seed%97)/97-.5)*.05,lng:ok?r.lng:ci.lng+(((seed*7)%89)/89-.5)*.05,approxLoc:!ok,seed,tour:null,amen:Array.isArray(r.amen)?r.amen:[],hours:r.hours||null,phone:r.phone||'',wa:r.wa||'',site:r.site||'',social:r.social||'',short:r.short||'',desc:r.desc||r.short||'',_live:true};
  p._h=hay(p);return p;
}
function applyListings(){
  for(let i=PLACES.length-1;i>=0;i--){const p=PLACES[i];if(p._live){delete PL[p.slug];delete PLID[p.id];PLACES.splice(i,1)}}
  Object.values(LIVE).forEach(r=>{const p=listingToPlace(r);if(p){PLACES.push(p);PL[p.slug]=p;PLID[p.id]=p}});
}
function sync(){
  if(!BOOKAPI.hosted)BKV=bkvFromDocs();
  const sig=JSON.stringify([TOURS,VER,SET,LIVE,PRICING,REV,OFF,AVL,BKS,CPS,PTN,AMB,EVT,STATS,CMPB,SETD,BKV,BOOKED_X]);if(sig===allSig)return;allSig=sig;applyListings();applyMeta();applyTours();
  const name=curRaw().split('-')[0];
  const typing=document.activeElement&&app.contains(document.activeElement)&&/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if(name==='admin')fillAdmin();
  else if(name==='account'){if(typing)fillBkList();else fillAccount()}
  else if(name==='bookings')fillBookings();
  else if(name==='partners')fillPartners();
  else if(name==='insights')fillInsights();
  else if(name==='place'&&typing)curParts();
  else if(!app.querySelector('.tv,.sov,.drawer'))route();
  tryPending();
}
const docsMap=(snap,keep)=>{const m={};snap.docs.forEach(d=>{const v=d.data();if(v&&keep(v,d.id))m[d.id]=v});return m};
function onTours(snap){TOURS=docsMap(snap,v=>v.embedUrl);sync()}
function onListings(snap){LIVE=docsMap(snap,v=>v.id&&v.name);sync()}
function onVerify(snap){VER=docsMap(snap,v=>v.items);sync()}
async function initCaps(){
  try{if(!window.claude||!claude.use)return;
    const u=await claude.use('user');CAN=u?await u.canEdit():false;
    DB=await claude.use('db');
    if(DB){const bad=()=>{};DB.collection('tours').onSnapshot(onTours,()=>{DB=null;fillAdmin()});DB.collection('verify').onSnapshot(onVerify,bad);DB.collection('stats').onSnapshot(s=>{fillMap(STATS,docsMap(s,()=>true));sync()},bad);['ambassadors','partners','campaigns','booking'].forEach(k=>DB.doc('settings/'+k).onSnapshot(s=>{SETD[k]=(s.exists&&s.data())||{};sync()},bad));[['reviews',REV],['offers',OFF],['availability',AVL]].forEach(([c,m])=>DB.collection(c).onSnapshot(s=>{fillMap(m,docsMap(s,()=>true));if(c==='offers')DBREADY=true;sync()},bad));DB.collection('listings').onSnapshot(onListings,bad);DB.doc('settings/pricing').onSnapshot(s=>{const d=s.exists&&s.data();PRICING=Object.assign({monthly:250,yearly:3000,commission:5},d?{monthly:d.monthly,yearly:d.yearly,commission:d.commission}:{});sync()},bad);DB.doc('settings/site').onSnapshot(s=>{SET=(s.exists&&s.data())||{};sync()},bad)}
  }catch(e){console.warn(e)}
  try{if(window.claude&&claude.use){const u=await claude.use('user');ACC.uid=u?await u.id():null}else ACC.uid=null}catch(e){ACC.uid=null}
  startAcc();if(ACC.uid&&BOOKAPI.hosted){JW_BOOK.profile().then(p=>{BKPROF=p;if(BK.F&&BK.step==='form'){if(!BK.F.name)BK.F.name=p.name||'';if(!BK.F.phone)BK.F.phone=p.phone||'';const pl=BK.pid&&PLID[BK.pid];if(pl&&$('#bk'))fillBooking(pl)}fillAccount()}).catch(()=>{});bkLoad();setInterval(()=>{if(!document.hidden)bkLoad()},12000)}
  Analytics.ready=true;Analytics.flush();fillAdmin();fillAccount();curParts();fillPartners();
}

/* ---------- admin: tour links manager ---------- */
const ADM={parsed:null,sel:'',prov:'kuula'};
function viewAdmin(){
  MOUNT.push(fillAdmin);
  return `<section class="phead"><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>لوحة الإدارة</span> · <a href="#insights" style="text-decoration:underline">التحليلات والحملات</a></div><div class="eyebrow lat" style="letter-spacing:.2em">Tours manager</div><h1>إدارة روابط الجولات</h1><p>أضف رابط جولة Kuula لأي مكان بلصقه هنا — بدون لمس الكود. تظهر الجولة فورًا في صفحة المكان وزر «ابدأ جولة 360°».</p></div></section>
  <section class="sec"><div class="wrap" id="adm"></div></section>`;
}
function admStatus(){
  if(!window.claude)return {ok:false,msg:NOBACK};
  if(DB===null&&CAN===null)return {ok:false,msg:'جارٍ التحقق من الصلاحيات…'};
  if(!DB)return {ok:false,msg:LOGIN_HINT()};
  if(!CAN)return {ok:false,msg:PATHMODE?'الإضافة والحذف متاحان لمدير الموقع فقط. يمكنك مشاهدة الروابط المحفوظة.':'الإضافة والحذف متاحان لمحرري الصفحة فقط (المالك أو من مُنح صلاحية «Editor»). يمكنك مشاهدة الروابط المحفوظة.'};
  return {ok:true};
}
function fillAdmin(){
  const host=$('#adm');if(!host)return;
  {const gd=ownerGuard();if(gd){host.innerHTML=gd;return}}
  const st=admStatus(),keep=host.querySelector('#kin')?host.querySelector('#kin').value:'';
  const byCity={};PLACES.forEach(p=>{(byCity[p.city]=byCity[p.city]||[]).push(p)});
  const opts=activeCities.map(c=>`<optgroup label="${esc(c.ar)}">${(byCity[c.slug]||[]).map(p=>`<option value="${p.id}"${ADM.sel===p.id?' selected':''}>${esc(p.name)} — ${esc(CAT[p.cat].ar)}</option>`).join('')}</optgroup>`).join('');
  const pv=TourProviders[ADM.prov];
  const rows=Object.keys(TOURS).filter(id=>PLID[id]).map(id=>{const p=PLID[id],t=TOURS[id];return `<div class="admrow"><div><b>${esc(p.name)}</b><small>${esc(CITY[p.city].ar)} · ${esc(CAT[p.cat].ar)} · ${esc((TourProviders[t.provider]||{}).label||t.provider)} · <bdi class="num">${esc(t.tourId||'')}</bdi></small></div><div class="admact"><a class="btn btn-line btn-sm" href="#place-${p.slug}">الصفحة</a><button class="btn btn-line btn-sm" data-act="adm-test" data-id="${id}">معاينة</button>${st.ok?`<button class="btn btn-line btn-sm" data-act="adm-edit" data-id="${id}">تعديل</button><button class="btn btn-line btn-sm danger" data-act="adm-del" data-id="${id}">حذف</button>`:''}</div></div>`}).join('');
  const sp=ADM.sel?PLID[ADM.sel]:null,sv=sp?(VER[sp.id]||{}):{};
  const verAdm=`<div class="card"><h2 style="font-size:20px">قائمة التحقق</h2>${sp?`<p style="color:var(--muted);margin:4px 0 10px">${esc(sp.name)} — ${verOk(sp.id)?'مكتمل ✓':'غير مكتمل'}</p>${VERIFY_ITEMS.map(([k,t])=>`<label class="vfrow"><input type="checkbox" data-vf="${k}" ${sv.items&&sv.items[k]?'checked':''} ${st.ok?'':'disabled'}> ${t}</label>`).join('')}<small class="admhint">تظهر شارة «تم التحقق» للزوار عند اكتمال البنود كلها فقط.</small>`:'<p style="color:var(--muted)">اختر مكانًا من القائمة أعلاه لعرض بنود التحقق.</p>'}</div>`;
  const qrAdm=`<div class="card"><h2 style="font-size:20px">رموز QR</h2>${sp?qrBlock('property',sp,'صفحة المكان')+(sp.tour?qrBlock('tour',sp,'الجولة 360°'):''):'<p style="color:var(--muted)">اختر مكانًا لعرض رموزه.</p>'}</div>`;
  const setAdm=`<div class="card" style="margin-top:20px"><h2 style="font-size:20px">الرابط العام للموقع</h2><p style="color:var(--muted);margin:4px 0 10px;font-size:14px">يُبنى عليه كل رمز QR. اكتب عنوان موقعك الفعلي (https) بعد الاستضافة؛ الرموز المطبوعة قبل ذلك لن تعمل.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><input id="kbase" class="admin-in" style="flex:1;min-width:240px" dir="ltr" placeholder="https://jawlat360.example" value="${esc(SET.baseUrl||'')}" ${st.ok?'':'disabled'}><button class="btn btn-brand" data-act="adm-base" ${st.ok?'':'disabled'}>حفظ</button></div></div>`;
  host.innerHTML=`${st.ok?'':`<div class="admnote warn">${esc(st.msg)}</div>`}
  <div class="admgrid"><div class="card"><h2 style="font-size:20px">إضافة / تحديث جولة</h2>
   <label class="admlbl" for="kpl">١. اختر المكان</label><select id="kpl" class="admin-in" data-adm="sel"><option value="">— اختر —</option>${opts}</select>
   <label class="admlbl" for="kpv">٢. المزوّد</label><select id="kpv" class="admin-in" data-adm="prov">${Object.keys(TourProviders).map(k=>`<option value="${k}"${ADM.prov===k?' selected':''}>${TourProviders[k].label}</option>`).join('')}</select>
   <label class="admlbl" for="kin">٣. الصق الرابط أو كود التضمين</label><textarea id="kin" class="admin-in" rows="4" dir="ltr" placeholder="https://kuula.co/share/XXXXXX" ${st.ok?'':'disabled'}>${esc(keep)}</textarea><small class="admhint">${esc(pv.hint)}</small>
   <div class="admbtns"><button class="btn btn-line" data-act="adm-parse" ${st.ok?'':'disabled'}>تحقق ومعاينة</button><button class="btn btn-brand" data-act="adm-save" ${st.ok&&ADM.parsed?'':'disabled'}>حفظ الجولة</button></div>
   <div id="admprev">${ADM.parsed?`<div class="admnote ok">تم التعرّف على الجولة (<bdi class="num">${esc(ADM.parsed.tourId)}</bdi>). اضغط «حفظ الجولة».</div><bdi class="num admurl">${esc(ADM.parsed.embedUrl)}</bdi>`:''}</div></div>
  <div class="card"><h2 style="font-size:20px">الجولات المحفوظة <span class="num" style="color:var(--muted);font-size:15px">(${Object.keys(TOURS).length})</span></h2>${rows||'<p style="color:var(--muted)">لا توجد جولات Kuula بعد. الأماكن التي لا تحمل جولة محفوظة تعرض معاينة تجريبية أو لا تعرض زر جولة.</p>'}
   <div class="admnote" style="margin-top:16px"><b>كيف أحصل على الرابط؟</b> في Kuula افتح جولتك ← Share ← انسخ Link أو Embed code ← الصقه هنا. الجولات يجب أن تكون Public أو Unlisted لتظهر للزوار.</div></div></div>
  <div class="admgrid" style="margin-top:20px">${verAdm}${qrAdm}</div>${setAdm}`;
}
let admQ=Promise.resolve();
function admVerify(k,on){
  const st=admStatus();if(!st.ok||!ADM.sel)return;const id=ADM.sel;
  admQ=admQ.then(async()=>{
    const cur=VER[id]||{},items=Object.assign({},cur.items||{},{[k]:!!on});
    const all=VERIFY_ITEMS.every(([x])=>items[x]);
    try{await DB.doc('verify/'+id).set({items,updatedAt:new Date().toISOString(),verifiedAt:all?(cur.verifiedAt||new Date().toISOString()):null})}
    catch(e){toast('تعذّر حفظ بند التحقق');fillAdmin()}
  });
}
async function admBase(){
  const st=admStatus();if(!st.ok)return;let v=(($('#kbase')||{}).value||'').trim();
  if(v){try{const u=new URL(v);if(u.protocol!=='https:')throw 0;v=u.origin+u.pathname.replace(/\/+$/,'')}catch(_){toast('اكتب عنوانًا صحيحًا يبدأ بـ https://');return}}
  try{await DB.doc('settings/site').set(Object.assign({},SET,{baseUrl:v,updatedAt:new Date().toISOString()}));toast(v?'تم حفظ الرابط العام':'تم مسح الرابط العام')}catch(e){toast('تعذّر الحفظ')}
}
async function qrDownload(kind,id){
  if((kind==='property'||kind==='tour')&&!PLID[id])return;const svg=QR.svg(qrUrl(kind,id),1024);
  try{const dl=window.claude&&await claude.use('downloads');if(!dl)throw 0;await dl.save({filename:`qr-${kind}-${id}.svg`,data:svg})}
  catch(e){if(e&&e.code==='cancelled')return;copyText(qrUrl(kind,id),'تعذّر التنزيل هنا — تم نسخ الرابط')}
}
async function admSave(){
  const st=admStatus();if(!st.ok)return;
  if(!ADM.sel){toast('اختر المكان أولًا');return}
  if(!ADM.parsed){toast('اضغط «تحقق ومعاينة» أولًا');return}
  try{await DB.doc('tours/'+ADM.sel).set({provider:ADM.prov,embedUrl:ADM.parsed.embedUrl,tourId:ADM.parsed.tourId,thumbnail:null,updatedAt:new Date().toISOString()});ADM.parsed=null;toast('تم حفظ الجولة');const k=$('#kin');if(k)k.value='';fillAdmin()}
  catch(e){toast(e&&e.code==='invalid_argument'?'ليست لديك صلاحية الكتابة':'تعذّر الحفظ، حاول مرة أخرى')}
}


/* ---------- accounts + owner dashboard (Phase 3) ---------- */
const STATUS_AR={pending:'قيد المراجعة',published:'منشور',rejected:'مرفوض',unpublished:'موقوف'};
const newDraft=()=>({cat:'chalets',city:'dammam',district:'',name:'',en:'',short:'',desc:'',price:'',unit:'',hours:'',phone:'',wa:'',site:'',social:'',lat:'',lng:'',a:{},amen:[]});
const ACC={uid:undefined,draft:newDraft(),edit:null,items:{},profile:null,noWrite:false,all:{},owners:{},subs:{},started:false,err:''};
function startAcc(){
  if(ACC.started||!DB||!ACC.uid)return;ACC.started=true;const bad=()=>{};
  const me=DB.doc('submissions/'+ACC.uid);
  me.onSnapshot(s=>{ACC.profile=s.exists?s.data():null;fillAccount()},bad);
  me.collection('items').onSnapshot(s=>{ACC.items=docsMap(s,()=>true);fillAccount()},bad);
  if(!CAN){['partners','ambassadors','events'].forEach(c=>DB.doc(c+'/'+ACC.uid).onSnapshot(s=>{if(s.exists)MAPS[c][ACC.uid]=s.data();else delete MAPS[c][ACC.uid];sync()},bad))}
  else{['partners','ambassadors','events'].forEach(c=>DB.collection(c).onSnapshot(s=>{fillMap(MAPS[c],docsMap(s,()=>true));sync()},bad));DB.collection('campaigns').onSnapshot(s=>{fillMap(CMPB,docsMap(s,()=>true));sync()},bad)}
  if(!CAN){DB.doc('bookings/'+ACC.uid).onSnapshot(s=>{if(s.exists)BKS[ACC.uid]=s.data();else delete BKS[ACC.uid];sync()},bad);DB.doc('complaints/'+ACC.uid).onSnapshot(s=>{if(s.exists)CPS[ACC.uid]=s.data();else delete CPS[ACC.uid];sync()},bad)}
  else{DB.collection('bookings').onSnapshot(s=>{fillMap(BKS,docsMap(s,()=>true));sync()},bad);DB.collection('complaints').onSnapshot(s=>{fillMap(CPS,docsMap(s,()=>true));sync()},bad)}
  if(CAN)DB.collection('submissions').onSnapshot(s=>{
    ACC.owners=docsMap(s,()=>true);
    s.docs.forEach(d=>{if(!ACC.subs[d.id])ACC.subs[d.id]=DB.doc('submissions/'+d.id).collection('items').onSnapshot(ss=>{ACC.all[d.id]=docsMap(ss,()=>true);fillAccount()},bad)});
    fillAccount()},bad);
}
function viewAccount(){
  MOUNT.push(fillAccount);
  return `<section class="phead"><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>حسابي</span></div><div class="eyebrow lat" style="letter-spacing:.2em">Owner dashboard</div><h1 id="acch1">حسابي</h1><p id="accp">بياناتك وحجوزاتك في مكان واحد.</p></div></section><section class="sec"><div class="wrap" id="acc"></div></section>`;
}
function stChip(s){return `<span class="stchip st-${s}">${STATUS_AR[s]||s}</span>`}
function fld(id,label,val,o={}){return `<div class="fl${o.full?' full':''}"><label class="admlbl" for="${id}">${label}</label>${o.area?`<textarea id="${id}" class="admin-in" rows="3">${esc(val)}</textarea>`:`<input id="${id}" class="admin-in" type="${o.type||'text'}" ${o.type==='number'?'inputmode="decimal" step="any"':''} value="${esc(val)}" ${o.dir?`dir="${o.dir}"`:''} ${o.ph?`placeholder="${esc(o.ph)}"`:''}>`}</div>`}
function accForm(){
  const d=ACC.draft,c=CAT[d.cat]||CATS[0];
  const dyn=c.fields.map(f=>{const v=d.a[f.k],id='afa-'+f.k,lab=f.l+(f.u?` (${f.u})`:'');
    if(f.t==='bool')return `<div class="fl"><label class="admlbl" for="${id}">${f.l}</label><select id="${id}" class="admin-in"><option value="">غير محدد</option><option value="1"${v===true?' selected':''}>متوفر</option><option value="0"${v===false?' selected':''}>غير متوفر</option></select></div>`;
    return fld(id,lab,v===undefined||v===null?'':v,{type:f.t==='text'?'text':'number'})}).join('');
  return `<div class="card"><h2 style="font-size:20px">${ACC.edit?'تعديل المنشأة':'إضافة منشأة'}</h2><p class="admhint" style="margin:4px 0 0">الحقول تتغير تلقائيًا حسب التصنيف. تُرسل المنشأة للمراجعة ولا تظهر في الموقع قبل موافقة الإدارة.</p>
  <div class="fgrid"><div class="fl"><label class="admlbl" for="af-cat">التصنيف</label><select id="af-cat" class="admin-in" data-acc="cat">${CATS.map(x=>`<option value="${x.slug}"${x.slug===d.cat?' selected':''}>${x.ar}</option>`).join('')}</select></div>
  <div class="fl"><label class="admlbl" for="af-city">المدينة</label><select id="af-city" class="admin-in">${activeCities.map(x=>`<option value="${x.slug}"${x.slug===d.city?' selected':''}>${x.ar}</option>`).join('')}</select></div>
  ${fld('af-name','اسم المنشأة',d.name)}${fld('af-en','الاسم بالإنجليزية (اختياري)',d.en,{dir:'ltr'})}${fld('af-district','الحي',d.district)}${fld('af-hours','ساعات العمل (اختياري)',d.hours)}
  ${fld('af-short','وصف قصير (سطر واحد)',d.short,{full:true})}${fld('af-desc','الوصف الكامل',d.desc,{full:true,area:true})}
  ${fld('af-price','السعر (ر.س) — اختياري',d.price,{type:'number'})}${fld('af-unit','وحدة السعر',d.unit,{ph:'لليلة / للشخص / تبدأ من'})}
  ${fld('af-phone','رقم الجوال',d.phone,{dir:'ltr',ph:'+966…'})}${fld('af-wa','واتساب (اختياري)',d.wa,{dir:'ltr'})}${fld('af-site','الموقع الإلكتروني (اختياري)',d.site,{dir:'ltr'})}${fld('af-social','حساب التواصل (اختياري)',d.social,{dir:'ltr'})}
  ${fld('af-lat','خط العرض (اختياري)',d.lat,{type:'number',dir:'ltr'})}${fld('af-lng','خط الطول (اختياري)',d.lng,{type:'number',dir:'ltr'})}</div>
  <small class="admhint">إن تركت الإحداثيات فارغة يظهر موضع تقريبي قرب مركز المدينة ويُوسم «تقريبي».</small>
  <h3 class="subh">تفاصيل ${c.ar}</h3><div class="fgrid">${dyn}</div>
  ${c.amen.length?`<h3 class="subh">الخدمات والمرافق</h3><div class="amgrid">${c.amen.map(x=>`<label class="vfrow"><input type="checkbox" data-am="${esc(x)}" ${d.amen.includes(x)?'checked':''}> ${esc(x)}</label>`).join('')}</div>`:''}
  ${ACC.err?`<div class="admnote warn">${esc(ACC.err)}</div>`:''}
  <div class="admbtns"><button class="btn btn-brand" data-act="acc-save">${ACC.edit?'حفظ وإعادة الإرسال للمراجعة':'إرسال للمراجعة'}</button>${ACC.edit?'<button class="btn btn-line" data-act="acc-new">إلغاء التعديل</button>':''}</div></div>`;
}
function readForm(){
  if(!$('#af-name'))return;const g=id=>(($('#'+id)||{}).value||'').trim(),d=ACC.draft;
  d.cat=g('af-cat')||d.cat;d.city=g('af-city')||d.city;
  ['name','en','district','hours','short','desc','price','unit','phone','wa','site','social','lat','lng'].forEach(k=>{d[k]=g('af-'+k)});
  const c=CAT[d.cat];d.a={};if(c)c.fields.forEach(f=>{const el=$('#afa-'+f.k);if(!el)return;const v=el.value.trim();if(v==='')return;d.a[f.k]=f.t==='bool'?v==='1':f.t==='text'?v:Number(v)});
  d.amen=Array.from(document.querySelectorAll('[data-am]')).filter(x=>x.checked).map(x=>x.dataset.am);
}
function fillAccount(){
  const host=$('#acc');if(!host)return;
  if(host.querySelector('#af-name'))readForm();
  const msg=(t,w)=>{host.innerHTML=`<div class="admnote${w?' warn':''}" style="margin:0">${t}</div>`};
  if(!window.claude)return msg(NOBACK,true);
  if(ACC.uid===undefined||(DB===null&&CAN===null))return msg('جارٍ تحميل حسابك…');
  if(!ACC.uid){const t=$('#acch1');if(t)t.textContent='حسابي';return void(host.innerHTML=loginCard('سجّل الدخول إلى حسابك','أنشئ حسابًا أو سجّل الدخول لمتابعة حجوزاتك وبياناتك.','login'))}
  if(!DB)return msg('تعذّر الوصول إلى قاعدة البيانات المشتركة.',true);
  {const t=$('#acch1'),q=$('#accp');if(t)t.textContent=CAN?'لوحة المالك':'حسابي';if(q)q.textContent=CAN?'أضف المنشآت، فعّل الحجز، تابع الطلبات، وأدِر الجولات.':'بياناتك وحجوزاتك في مكان واحد.'}
  if(!CAN)return void(host.innerHTML=customerAccount()+accPhase4());
  const items=Object.values(ACC.items).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
  const cnt=s=>items.filter(i=>i.status===s).length;
  const P=PRICING;
  const role=CAN?'مدير الموقع':'مالك / عضو';
  let h=`<div class="accbar"><span class="stchip st-published">${role}</span><span class="num" style="color:var(--muted);font-size:14px">${items.length} منشأة · ${cnt('published')} منشورة · ${cnt('pending')} قيد المراجعة</span></div>`;
  if(ACC.noWrite)h+=`<div class="admnote warn" style="margin:0 0 18px">حسابك يملك صلاحية المشاهدة فقط. اطلب من الإدارة منحك صلاحية «Contributor» لتتمكن من إضافة منشأتك.</div>`;
  if(CAN)h+=adminBookings()+bkSettingsCard()+adminQueue()+adminPhase4();
  h+=`<div class="admgrid"><div>${accForm()}</div><div class="stack2">
   <div class="card"><h2 style="font-size:20px">بيانات النشاط</h2>${fld('ap-biz','اسم النشاط التجاري',(ACC.profile&&ACC.profile.biz)||'')}${fld('ap-phone','جوال التواصل مع الإدارة',(ACC.profile&&ACC.profile.phone)||'',{dir:'ltr'})}<div class="admbtns"><button class="btn btn-line btn-sm" data-act="acc-profile">حفظ</button></div></div>
   <div class="card"><h2 style="font-size:20px">باقة المالك</h2><ul class="verlist" style="color:var(--ink)"><li><b class="num">${esc(P.monthly)}</b> ر.س شهريًا لكل وحدة نشطة</li><li>أو <b class="num">${esc(P.yearly)}</b> ر.س سنويًا</li><li>عمولة <b class="num">${esc(P.commission)}%</b> على الحجوزات (عند تفعيل الحجز)</li><li>التصوير 360° مجاني للمالك وفق الاتفاق</li></ul><p class="cap">الأسعار تحددها الإدارة وقد تتغير. لا اشتراك يُحصَّل في هذه النسخة.</p></div></div></div>
   <div class="card" style="margin-top:20px"><h2 style="font-size:20px">منشآتي</h2>${items.length?items.map(i=>ownItemRow(i)).join(''):'<p style="color:var(--muted)">لم تضف منشآت بعد.</p>'}</div>`;
  h+=accPhase4();
  host.innerHTML=h;
}
function ownItemRow(i){
  const c=CAT[i.cat],ci=CITY[i.city];const live=i.status==='published'&&LIVE[i.id];
  return `<div class="admrow"><div><b>${esc(i.name)}</b><small>${esc(ci?ci.ar:'')} · ${esc(c?c.ar:'')} ${stChip(i.status)}</small>${i.status==='rejected'&&i.note?`<small style="color:#b3261e">سبب الرفض: ${esc(i.note)}</small>`:''}</div><div class="admact">${live?`<a class="btn btn-line btn-sm" href="#place-x-${i.id}">الصفحة</a>`:''}${i.status==='published'?'':`<button class="btn btn-line btn-sm" data-act="acc-edit" data-id="${i.id}">تعديل</button><button class="btn btn-line btn-sm danger" data-act="acc-del" data-id="${i.id}">حذف</button>`}</div></div>`;
}
function adminQueue(){
  const rows=[];Object.entries(ACC.all).forEach(([uid,m])=>Object.values(m).forEach(i=>rows.push([uid,i])));
  rows.sort((x,y)=>(y[1].createdAt||'').localeCompare(x[1].createdAt||''));
  const pend=rows.filter(([,i])=>i.status==='pending'),other=rows.filter(([,i])=>i.status!=='pending');
  const row=([uid,i],full)=>{const c=CAT[i.cat],ci=CITY[i.city],ow=ACC.owners[uid]||{};
    return `<div class="admrow"><div><b>${esc(i.name)}</b><small>${esc(ci?ci.ar:'')} · ${esc(c?c.ar:'')} · ${esc(i.district||'')} ${stChip(i.status)}</small><small>المالك: ${esc(ow.biz||'(بدون اسم نشاط)')} · <bdi class="num">${esc(i.phone||'')}</bdi></small>${full?`<small>${esc(i.short||'')}</small>`:''}</div><div class="admact">${i.status==='pending'?`<button class="btn btn-brand btn-sm" data-act="rv-ok" data-uid="${uid}" data-id="${i.id}">موافقة ونشر</button><input id="rn-${i.id}" class="admin-in" style="width:150px;padding:7px 10px" placeholder="سبب الرفض"><button class="btn btn-line btn-sm danger" data-act="rv-no" data-uid="${uid}" data-id="${i.id}">رفض</button>`:i.status==='published'?`<a class="btn btn-line btn-sm" href="#place-x-${i.id}">الصفحة</a><button class="btn btn-line btn-sm danger" data-act="rv-off" data-uid="${uid}" data-id="${i.id}">إيقاف النشر</button>`:''}</div></div>`};
  const P=PRICING;
  return `<div class="admgrid" style="margin-bottom:20px"><div class="card"><h2 style="font-size:20px">طلبات المراجعة <span class="num" style="color:var(--muted);font-size:15px">(${pend.length})</span></h2>${pend.length?pend.map(r=>row(r,true)).join(''):'<p style="color:var(--muted)">لا توجد طلبات قيد المراجعة.</p>'}${other.length?`<h3 class="subh">سجل القرارات</h3>${other.map(r=>row(r)).join('')}`:''}</div>
  <div class="card"><h2 style="font-size:20px">أسعار باقة المالك</h2><div class="fgrid">${fld('pr-m','شهريًا لكل وحدة (ر.س)',P.monthly,{type:'number'})}${fld('pr-y','سنويًا (ر.س)',P.yearly,{type:'number'})}${fld('pr-c','عمولة الحجز (%)',P.commission,{type:'number'})}</div><div class="admbtns"><button class="btn btn-brand btn-sm" data-act="pr-save">حفظ الأسعار</button></div><p class="cap">قيمة الحجوزات الإجمالية (GMV) ليست إيرادًا للمنصة؛ الإيراد هو الاشتراك والعمولة فقط.</p></div></div>`;
}
const gid=()=>'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
async function accSave(){
  readForm();const d=ACC.draft,c=CAT[d.cat];ACC.err='';
  if(d.name.length<3)ACC.err='اكتب اسم المنشأة (3 أحرف على الأقل).';
  else if(!d.district)ACC.err='اكتب اسم الحي.';
  else if(d.short.length<10)ACC.err='اكتب وصفًا قصيرًا (10 أحرف على الأقل).';
  else if(!/^\+?[0-9\s-]{8,16}$/.test(d.phone))ACC.err='رقم الجوال غير صالح.';
  else if(d.price!==''&&!(Number(d.price)>=0))ACC.err='السعر غير صالح.';
  else if((d.lat!==''||d.lng!=='')&&!(isFinite(+d.lat)&&isFinite(+d.lng)&&d.lat!==''&&d.lng!==''&&Math.abs(+d.lat)<=90&&Math.abs(+d.lng)<=180))ACC.err='أدخل خط العرض والطول معًا بقيم صحيحة.';
  if(ACC.err){fillAccount();return}
  const id=ACC.edit||gid(),old=ACC.items[id]||{},now=new Date().toISOString();
  const rec={id,cat:d.cat,city:d.city,district:d.district,name:d.name,en:d.en,short:d.short,desc:d.desc,unit:d.unit,hours:d.hours,phone:d.phone,wa:d.wa,site:d.site,social:d.social,a:d.a,amen:d.amen,status:'pending',note:'',createdAt:old.createdAt||now,updatedAt:now};
  if(d.price!=='')rec.price=Number(d.price);
  if(d.lat!==''){rec.lat=+d.lat;rec.lng=+d.lng}
  try{
    await DB.doc('submissions/'+ACC.uid).set({biz:(ACC.profile&&ACC.profile.biz)||'',phone:(ACC.profile&&ACC.profile.phone)||'',updatedAt:now});
    await DB.doc('submissions/'+ACC.uid+'/items/'+id).set(rec);
    ACC.draft=newDraft();ACC.edit=null;ACC.noWrite=false;toast('أُرسلت المنشأة للمراجعة');
  }catch(e){if(e&&e.code==='invalid_argument'){ACC.noWrite=true;ACC.err='ليست لديك صلاحية الإضافة.'}else ACC.err='تعذّر الحفظ، حاول مرة أخرى.'}
  fillAccount();
}
async function accProfile(){
  const biz=(($('#ap-biz')||{}).value||'').trim(),phone=(($('#ap-phone')||{}).value||'').trim();
  try{await DB.doc('submissions/'+ACC.uid).set({biz,phone,updatedAt:new Date().toISOString()});toast('تم حفظ بيانات النشاط')}catch(e){if(e&&e.code==='invalid_argument')ACC.noWrite=true;toast('تعذّر الحفظ');fillAccount()}
}
const sure=(a,label)=>{if(a.dataset.sure==='1')return true;a.dataset.sure='1';a.textContent='تأكيد '+label;setTimeout(()=>{if(a.isConnected){a.dataset.sure='';a.textContent=label}},4000);return false};
async function review(kind,uid,id,a){
  if(!CAN)return;const path='submissions/'+uid+'/items/'+id,rec=(ACC.all[uid]||{})[id];if(!rec)return;const now=new Date().toISOString();
  try{
    if(kind==='ok'){const {note,...rest}=rec;await DB.doc('listings/'+id).set(Object.assign({},rest,{status:'published',ownerUid:uid,publishedAt:now}));await DB.doc(path).update({status:'published',note:'',reviewedAt:now});toast('تم نشر المنشأة')}
    else if(kind==='no'){const n=(($('#rn-'+id)||{}).value||'').trim();if(!n){toast('اكتب سبب الرفض');return}await DB.doc(path).update({status:'rejected',note:n,reviewedAt:now});toast('تم رفض الطلب')}
    else if(kind==='off'){if(!sure(a,'إيقاف النشر'))return;await DB.doc('listings/'+id).delete();await DB.doc(path).update({status:'unpublished',reviewedAt:now});toast('تم إيقاف النشر')}
  }catch(e){toast('تعذّر تنفيذ الإجراء')}
}
async function savePricing(){
  if(!CAN)return;const n=id=>Number((($('#'+id)||{}).value||'').trim());const m=n('pr-m'),y=n('pr-y'),c=n('pr-c');
  if(![m,y,c].every(x=>isFinite(x)&&x>=0)||c>100){toast('تحقق من القيم المدخلة');return}
  try{await DB.doc('settings/pricing').set({monthly:m,yearly:y,commission:c,updatedAt:new Date().toISOString()});toast('تم حفظ الأسعار')}catch(e){toast('تعذّر الحفظ')}
}


/* ---------- Phase 4: booking requests, calendar, offers, reviews, complaints ---------- */
const REV={},OFF={},AVL={},BKS={},CPS={};let DBREADY=false;
const PTN={},AMB={},EVT={},STATS={},CMPB={},SETD={ambassadors:{},partners:{},campaigns:{},booking:{}};
const MAPS={reviews:REV,offers:OFF,availability:AVL,bookings:BKS,complaints:CPS,partners:PTN,ambassadors:AMB,events:EVT,campaigns:CMPB};
const fillMap=(m,n)=>{for(const k in m)delete m[k];Object.assign(m,n)};
const itemsOf=d=>(d&&d.items)||{};
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],DOW=['ح','ن','ث','ر','خ','ج','س'];
const pad2=n=>String(n).padStart(2,'0');
const isoD=(y,m,d)=>`${y}-${pad2(m+1)}-${pad2(d)}`;
const todayISO=()=>{const d=new Date();return isoD(d.getFullYear(),d.getMonth(),d.getDate())};
const addDays=(s,n)=>{const [y,m,d]=s.split('-').map(Number),t=new Date(y,m-1,d+n);return isoD(t.getFullYear(),t.getMonth(),t.getDate())};
const nightsBetween=(x,y)=>Math.round((Date.parse(y)-Date.parse(x))/864e5);
const nightList=(x,y)=>{const o=[];for(let d=x;d<y;d=addDays(d,1))o.push(d);return o};
const fmtD=s=>{if(!s)return '';const [y,m,d]=s.split('-').map(Number);return `${d} ${MONTHS[m-1]} ${y}`};
const MODE={booking:{t:'طلب حجز',btn:'أرسل طلب الحجز',date:'range'},'request-visit':{t:'طلب زيارة',btn:'أرسل طلب الزيارة',date:'one'},reservation:{t:'حجز طاولة',btn:'أرسل طلب الحجز',date:'one',time:true,party:true},appointment:{t:'طلب موعد',btn:'أرسل طلب الموعد',date:'one',time:true},inquiry:{t:'استفسار',btn:'أرسل الاستفسار',date:null},quote:{t:'طلب عرض سعر',btn:'أرسل الطلب',date:null}};
const BK_ST={requested:'بانتظار التأكيد',confirmed:'مؤكد',declined:'غير متاح',cancelled:'ملغي'};
const CP_TYPES=[['info','معلومات غير صحيحة'],['experience','تجربة سيئة'],['abuse','محتوى مسيء'],['other','أخرى']];
const CP_ST={new:'جديدة',reviewing:'قيد المعالجة',resolved:'تم الحل'};
const FM={};  /* free-form inputs for cp-/of-/bk-/rv- fields */

/* data accessors */
function reviewsFor(pid,all){const o=[];Object.entries(REV).forEach(([uid,d])=>{const r=itemsOf(d)[pid];if(r&&(all||!r.hidden))o.push(Object.assign({uid},r))});return o.sort((x,y)=>(y.at||'').localeCompare(x.at||''))}
function offersAll(all){const t=todayISO(),o=[];Object.entries(OFF).forEach(([uid,d])=>Object.entries(itemsOf(d)).forEach(([id,x])=>{if(PLID[x.pid]&&(all||(x.from<=t&&t<=x.to)))o.push(Object.assign({id,uid},x))}));return o.sort((x,y)=>(x.to||'').localeCompare(y.to||''))}
const offersFor=pid=>offersAll().filter(o=>o.pid===pid);
const ownerOf=pid=>(LIVE[pid]||{}).ownerUid||null;
const bookedSet=pid=>new Set((itemsOf(AVL.confirmed)[pid]||{}).booked||[]);
const blockedSet=pid=>new Set((itemsOf(AVL[ownerOf(pid)])[pid]||{}).blocked||[]);
function applyMeta(){
  PLACES.forEach(p=>{if(!p._live)return;const rs=reviewsFor(p.id);p.reviewCount=rs.length;p.rating=rs.length?Math.round(rs.reduce((s,r)=>s+r.stars,0)/rs.length*10)/10:0;p.bookings=(itemsOf(AVL.confirmed)[p.id]||{}).count||0});
}

/* generic writes: whole-document set (one doc per user per collection, read-modify-write behind a queue) */
let WQ=Promise.resolve();
function writeDoc(coll,id,mutate){
  const run=WQ.then(async()=>{const cur=MAPS[coll][id],n=JSON.parse(JSON.stringify(cur||{}));n.items=n.items||{};mutate(n);n.updatedAt=new Date().toISOString();await DB.doc(coll+'/'+id).set(n);MAPS[coll][id]=n});
  WQ=run.catch(()=>{});return run;
}
const writeMine=(coll,mutate)=>writeDoc(coll,ACC.uid,mutate);
const nid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function canWriteMsg(e){return e&&e.code==='invalid_argument'?(PATHMODE?'ليست لديك صلاحية لهذا الإجراء. تأكد من تسجيل الدخول.':'حسابك للمشاهدة فقط. اطلب من الإدارة صلاحية «Contributor».'):'تعذّر الإرسال، حاول مرة أخرى.'}

/* calendar */
function calHTML(o){ /* o:{y,m,a,b,booked:Set,blocked:Set,pick:'range'|'one'|'own',own:Set} */
  const first=new Date(o.y,o.m,1),dim=new Date(o.y,o.m+1,0).getDate(),t=todayISO();
  let cells='';for(let i=0;i<first.getDay();i++)cells+='<span></span>';
  for(let d=1;d<=dim;d++){
    const s=isoD(o.y,o.m,d),bk=o.booked.has(s),bl=o.blocked.has(s),past=s<t;
    const inR=o.a&&o.b&&s>=o.a&&s<=o.b,end=s===o.a||s===o.b;
    const cls=['cald',bk?'bk':'',bl?'bl':'',past?'past':'',inR?'inr':'',end?'end':'',o.own&&o.own.has(s)?'bl':''].filter(Boolean).join(' ');
    const dis=past||bk||(o.pick!=='own'&&bl);
    cells+=`<button class="${cls}" ${dis?'disabled':''} data-act="${o.pick==='own'?'oc-day':'bk-day'}" data-day="${s}" aria-label="${fmtD(s)}${bk?' محجوز':bl?' غير متاح':''}">${d}</button>`;
  }
  return `<div class="calh"><button class="iconbtn" data-act="${o.pick==='own'?'oc-nav':'bk-nav'}" data-d="-1" aria-label="الشهر السابق">${ic('arrow',18)}</button><b>${MONTHS[o.m]} ${o.y}</b><button class="iconbtn" data-act="${o.pick==='own'?'oc-nav':'bk-nav'}" data-d="1" aria-label="الشهر التالي"><span style="display:inline-flex;transform:scaleX(-1)">${ic('arrow',18)}</span></button></div><div class="calg">${DOW.map(x=>`<i>${x}</i>`).join('')}${cells}</div><div class="calkey"><span><i class="k0"></i>متاح</span><span><i class="k1"></i>محجوز</span><span><i class="k2"></i>غير متاح</span></div>`;
}
const nowYM=()=>{const d=new Date();return {y:d.getFullYear(),m:d.getMonth()}};

/* ---- place page parts ---- */
function placeParts(p){
  if(isDemo(p))return `<div class="demo-note">${ic('spark',20)}<span>الحجز والتقييمات والعروض متاحة للمنشآت المنشورة من أصحابها فقط، ولا تعمل على السجلات التجريبية.</span></div>`;
  return `<div id="of" data-pid="${p.id}"></div><div id="rv" data-pid="${p.id}"></div>`;
}
function curParts(){const e=app.querySelector('#bk')||app.querySelector('#rv');if(e)fillParts(e.dataset.pid)}
function fillParts(pid){const p=PLID[pid];if(!p||isDemo(p))return;bk2Cta(p);fillBooking(p);fillOffers(p);fillReviews(p)}
function fillOffers(p){
  const h=$('#of');if(!h)return;const o=offersFor(p.id);
  h.innerHTML=o.length?`<div class="card"><h2>العروض الحالية</h2>${o.map(x=>`<div class="offrow"><b>${esc(x.title)}</b><p>${esc(x.desc||'')}</p><small>ساري حتى ${esc(fmtD(x.to))} · العرض كما أدخله صاحب المنشأة</small><span class="qra"><button class="btn btn-line btn-sm" data-act="copy" data-text="${esc(qrUrl('offer',x.id))}" data-toast="تم نسخ رابط العرض">نسخ رابط العرض</button><button class="btn btn-line btn-sm" data-act="qr-dl" data-kind="offer" data-id="${x.id}">تنزيل QR</button></span></div>`).join('')}</div>`:'';
}
function stars(n,sz=15){let s='';for(let i=1;i<=5;i++)s+=`<span style="color:${i<=n?'var(--gold-ink)':'var(--line)'}">${ic('star',sz)}</span>`;return `<span class="stars" aria-label="${n} من 5">${s}</span>`}
function fillReviews(p){
  const h=$('#rv');if(!h)return;
  const rs=reviewsFor(p.id),mine=ACC.uid&&itemsOf(REV[ACC.uid])[p.id],own=ownerOf(p.id)===ACC.uid&&ACC.uid;
  const f=FM['rv-stars']||(mine?mine.stars:0);
  let form='';
  if(!window.claude)form='';
  else if(!ACC.uid)form='<p class="cap">سجّل الدخول لإضافة تقييم.</p>';
  else if(own)form='<p class="cap">لا يمكن تقييم منشأتك.</p>';
  else form=`<div class="rvform"><b>${mine?'تعديل تقييمك':'أضف تقييمك'}</b><div class="rvstars" role="radiogroup" aria-label="التقييم">${[1,2,3,4,5].map(i=>`<button type="button" data-act="rv-star" data-n="${i}" aria-pressed="${f===i}" class="${i<=f?'on':''}">${ic('star',24)}</button>`).join('')}</div>
   <input id="rv-name" class="admin-in" placeholder="الاسم الظاهر (اختياري)" value="${esc(FM['rv-name']!==undefined?FM['rv-name']:(mine&&mine.name)||'')}"><textarea id="rv-text" class="admin-in" rows="3" placeholder="اكتب تجربتك (10 أحرف على الأقل)">${esc(FM['rv-text']!==undefined?FM['rv-text']:(mine&&mine.text)||'')}</textarea>
   ${FM['rv-err']?`<div class="admnote warn">${esc(FM['rv-err'])}</div>`:''}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="rv-send" data-id="${p.id}">${mine?'تحديث التقييم':'نشر التقييم'}</button>${mine?`<button class="btn btn-line btn-sm danger" data-act="rv-del" data-id="${p.id}">حذف تقييمي</button>`:''}</div></div>`;
  h.innerHTML=`<div class="card"><h2>التقييمات${rs.length?` <span class="num" style="font-size:15px;color:var(--muted)">${p.rating.toFixed(1)} · ${rs.length}</span>`:''}</h2>${rs.length?rs.map(r=>`<div class="rvrow">${stars(r.stars)}<b>${esc(r.name||'زائر')}</b><small>${esc(fmtD((r.at||'').slice(0,10)))}</small><p>${esc(r.text||'')}</p></div>`).join(''):'<p style="color:var(--muted)">لا توجد تقييمات بعد.</p>'}${form}<p class="cap">التقييمات من حسابات مسجّلة وتخضع لمراجعة الإدارة. لا نعرض تقييمات مصطنعة.</p></div>`;
}
async function reviewSend(pid,a){
  const stars_=FM['rv-stars']||(itemsOf(REV[ACC.uid])[pid]||{}).stars||0,text=(FM['rv-text']!==undefined?FM['rv-text']:(itemsOf(REV[ACC.uid])[pid]||{}).text||'').trim(),name=(FM['rv-name']!==undefined?FM['rv-name']:(itemsOf(REV[ACC.uid])[pid]||{}).name||'').trim();
  FM['rv-err']='';if(!stars_)FM['rv-err']='اختر عدد النجوم.';else if(text.length<10)FM['rv-err']='اكتب تعليقًا من 10 أحرف على الأقل.';
  if(FM['rv-err']){fillReviews(PLID[pid]);return}
  try{await writeMine('reviews',n=>{n.items[pid]={stars:stars_,text,name:name.slice(0,40),at:new Date().toISOString()}});['rv-stars','rv-text','rv-name'].forEach(k=>delete FM[k]);toast('تم نشر تقييمك')}
  catch(e){FM['rv-err']=canWriteMsg(e);fillReviews(PLID[pid])}
}

/* ---- offers page + go-offer ---- */
function viewOffers(){
  const o=offersAll();
  MOUNT.push(()=>0);
  return `<section class="phead"><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>العروض</span></div><div class="eyebrow lat" style="letter-spacing:.2em">Offers</div><h1>العروض</h1><p>عروض أضافها أصحاب المنشآت. تظهر هنا طوال مدة سريانها فقط.</p></div></section><section class="sec"><div class="wrap">${o.length?`<div class="pgrid">${o.map(x=>{const p=PLID[x.pid];return `<a class="pcard" href="#place-${p.slug}"><div class="pimg" style="${bg(img(p,0))}" role="img" aria-label="صورة توضيحية"><div class="bds"><div><span class="bd bd-pick">عرض</span></div><div></div></div></div><div class="pbody"><div class="pmeta">${CITY[p.city].ar} · ${CAT[p.cat].ar}</div><h3>${esc(x.title)}</h3><p>${esc(x.desc||'')}</p><div class="pfoot"><span class="num" style="color:var(--muted);font-size:13px">حتى ${esc(fmtD(x.to))}</span><span class="go">${esc(p.name)} ${ic('arrow',16)}</span></div></div></a>`}).join('')}</div>`:`<div class="empty">${ic('spark',34)}<h3>${DBREADY?'لا توجد عروض سارية الآن':'جارٍ التحميل…'}</h3><p>عندما يضيف أصحاب المنشآت عروضًا ستظهر هنا.</p></div>`}</div></section>`;
}

/* ---- account: guest, owner and admin sections (Phase 4) ---- */
const OC={pid:'',y:0,m:0,sel:null};
function myLive(){return Object.values(ACC.items).filter(i=>i.status==='published'&&LIVE[i.id])}
function accPhase4(){
  const uid=ACC.uid;let h='';
  /* owner tools */
  const mine=myLive();
  if(mine.length){
    if(!OC.pid||!mine.find(i=>i.id===OC.pid)){OC.pid=mine[0].id;const n=nowYM();OC.y=n.y;OC.m=n.m;OC.sel=null}
    if(!OC.sel)OC.sel=new Set(((itemsOf(AVL[uid])[OC.pid])||{}).blocked||[]);
    h+=`<div class="admgrid" style="margin-top:20px"><div class="card"><h2 style="font-size:20px">تقويم منشأتي</h2><select class="admin-in" data-acc="ocpid" aria-label="المنشأة">${mine.map(i=>`<option value="${i.id}"${i.id===OC.pid?' selected':''}>${esc(i.name)}</option>`).join('')}</select><div class="cal" style="margin-top:12px">${calHTML({y:OC.y,m:OC.m,a:'',b:'',booked:bookedSet(OC.pid),blocked:new Set(),own:OC.sel,pick:'own'})}</div><p class="cap">اضغط على الأيام التي لا تستقبل فيها الطلبات لتصبح «غير متاح». الأيام المحجوزة تؤكدها الإدارة وتظهر محجوزة تلقائيًا.</p><div class="admbtns"><button class="btn btn-brand btn-sm" data-act="oc-save">حفظ التقويم</button></div></div>
    <div class="card"><h2 style="font-size:20px">عروضي</h2><select id="of-pid" class="admin-in" aria-label="المنشأة">${mine.map(i=>`<option value="${i.id}"${(FM['of-pid']||OC.pid)===i.id?' selected':''}>${esc(i.name)}</option>`).join('')}</select>${fld('of-title','عنوان العرض',FM['of-title']||'')}${fld('of-desc','التفاصيل',FM['of-desc']||'',{area:true})}<div class="fgrid">${fld('of-from','يبدأ',FM['of-from']||todayISO(),{type:'date'})}${fld('of-to','ينتهي',FM['of-to']||addDays(todayISO(),14),{type:'date'})}</div>${FM['of-err']?`<div class="admnote warn">${esc(FM['of-err'])}</div>`:''}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="of-save">نشر العرض</button></div>
    ${Object.entries(itemsOf(OFF[uid])).map(([id,x])=>`<div class="admrow"><div><b>${esc(x.title)}</b><small>${esc((PLID[x.pid]||{}).name||'')} · ${esc(fmtD(x.from))} ← ${esc(fmtD(x.to))}</small></div><div class="admact"><button class="btn btn-line btn-sm danger" data-act="of-del" data-id="${id}">حذف</button></div></div>`).join('')}</div></div>`;
  }
  if(mine.length)h+=`<div class="card" style="margin-top:20px"><h2 style="font-size:20px">أداء منشآتي</h2>${mine.map(i=>{const p=PLID[i.id],c=(itemsOf(AVL.confirmed)[i.id]||{}).count||0;return `<div class="admrow"><div><b>${esc(i.name)}</b><small>طلبات مؤكدة: <span class="num">${c}</span> · تقييمات: <span class="num">${p?p.reviewCount||0:0}</span>${p&&p.rating?' · المتوسط <span class="num">'+p.rating.toFixed(1)+'</span>':''} · عروض سارية: <span class="num">${offersFor(i.id).length}</span></small></div></div>`}).join('')}<p class="cap">أرقام من سجلات المنصة الفعلية. أعداد المشاهدات تتطلب خدمة تحليلات على الاستضافة الفعلية.</p></div>`;
  /* complaints */
  const cps=Object.values(itemsOf(CPS[uid])).sort((x,y)=>y.createdAt.localeCompare(x.createdAt));
  const lives=PLACES.filter(p=>p._live);
  h+=`<div class="admgrid" style="margin-top:20px"><div class="card"><h2 style="font-size:20px">شكوى أو بلاغ</h2><label class="admlbl" for="cp-type">النوع</label><select id="cp-type" class="admin-in">${CP_TYPES.map(([k,t])=>`<option value="${k}"${(FM['cp-type']||'info')===k?' selected':''}>${t}</option>`).join('')}</select><label class="admlbl" for="cp-pid">المنشأة (اختياري)</label><select id="cp-pid" class="admin-in"><option value="">— عامة —</option>${lives.map(p=>`<option value="${p.id}"${FM['cp-pid']===p.id?' selected':''}>${esc(p.name)}</option>`).join('')}</select>${fld('cp-text','التفاصيل',FM['cp-text']||'',{area:true})}${FM['cp-err']?`<div class="admnote warn">${esc(FM['cp-err'])}</div>`:''}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="cp-send">إرسال</button></div><p class="cap">تصل الشكوى للإدارة فقط ولا تظهر للعامة.</p></div>
  <div class="card"><h2 style="font-size:20px">شكاواي</h2>${cps.length?cps.map(c=>`<div class="admrow"><div><b>${esc((CP_TYPES.find(t=>t[0]===c.type)||[0,'أخرى'])[1])}</b><small>${esc(c.pid&&PLID[c.pid]?PLID[c.pid].name:'عامة')} <span class="stchip st-${c.status==='resolved'?'published':'pending'}">${CP_ST[c.status]||c.status}</span></small><small>${esc(c.text)}</small>${c.reply?`<small>رد الإدارة: ${esc(c.reply)}</small>`:''}</div></div>`).join(''):'<p style="color:var(--muted)">لا توجد شكاوى.</p>'}</div></div>`;
  return h;
}
function adminPhase4(){
  const cp=[];Object.entries(CPS).forEach(([uid,d])=>Object.values(itemsOf(d)).forEach(c=>cp.push([uid,c])));cp.sort((x,y)=>y[1].createdAt.localeCompare(x[1].createdAt));
  const crow=([uid,c])=>`<div class="admrow"><div><b>${esc((CP_TYPES.find(t=>t[0]===c.type)||[0,'أخرى'])[1])}</b><small>${esc(c.pid&&PLID[c.pid]?PLID[c.pid].name:'عامة')} <span class="stchip st-${c.status==='resolved'?'published':'pending'}">${CP_ST[c.status]||c.status}</span></small><small>${esc(c.text)}</small>${c.reply?`<small>ردّك: ${esc(c.reply)}</small>`:''}</div><div class="admact">${c.status!=='resolved'?`<input id="cpn-${c.id}" class="admin-in" style="width:150px;padding:7px 10px" placeholder="الرد"><button class="btn btn-brand btn-sm" data-act="cp-ok" data-uid="${uid}" data-id="${c.id}">تم الحل</button>`:''}</div></div>`;
  const rv=[];Object.entries(REV).forEach(([uid,d])=>Object.entries(itemsOf(d)).forEach(([pid,r])=>{if(PLID[pid])rv.push([uid,pid,r])}));
  const of=offersAll(true);
  return `<div class="admgrid" style="margin-bottom:20px">  <div class="card"><h2 style="font-size:20px">الشكاوى <span class="num" style="color:var(--muted);font-size:15px">(${cp.filter(([,c])=>c.status!=='resolved').length})</span></h2>${cp.length?cp.slice(0,15).map(crow).join(''):'<p style="color:var(--muted)">لا توجد شكاوى.</p>'}</div></div>
  <div class="admgrid" style="margin-bottom:20px"><div class="card"><h2 style="font-size:20px">مراجعة التقييمات <span class="num" style="color:var(--muted);font-size:15px">(${rv.length})</span></h2>${rv.length?rv.slice(0,20).map(([uid,pid,r])=>`<div class="admrow"><div><b>${esc(PLID[pid].name)}</b><small>${stars(r.stars,13)} ${esc(r.name||'زائر')}${r.hidden?' · <span class="stchip st-rejected">مخفي</span>':''}</small><small>${esc(r.text)}</small></div><div class="admact"><button class="btn btn-line btn-sm" data-act="rvm" data-uid="${uid}" data-id="${pid}">${r.hidden?'إظهار':'إخفاء'}</button></div></div>`).join(''):'<p style="color:var(--muted)">لا توجد تقييمات.</p>'}</div>
  <div class="card"><h2 style="font-size:20px">العروض المنشورة <span class="num" style="color:var(--muted);font-size:15px">(${of.length})</span></h2>${of.length?of.map(x=>`<div class="admrow"><div><b>${esc(x.title)}</b><small>${esc(PLID[x.pid].name)} · حتى ${esc(fmtD(x.to))}</small></div><div class="admact"><button class="btn btn-line btn-sm danger" data-act="ofm-del" data-uid="${x.uid}" data-id="${x.id}">إزالة</button></div></div>`).join(''):'<p style="color:var(--muted)">لا توجد عروض.</p>'}</div></div>`;
}
/* ---------- Phase 5: partners, ambassadors, campaigns, analytics ---------- */
const SRC=(()=>{try{return JSON.parse(sessionStorage.getItem('jl_src')||'null')}catch(e){return null}})();
function setSrc(type,id){const o={type,id};try{sessionStorage.setItem('jl_src',JSON.stringify(o))}catch(e){}Object.assign(SRC||(window.__SRC={}),o);SRCV.v=o}
const SRCV={v:SRC};
const srcTag=()=>SRCV.v?SRCV.v.type+':'+SRCV.v.id:'';
/* AnalyticsProvider (swappable: replace track/flush with GA/Plausible later) */
const Analytics={name:'sample-db',pend:[],timer:0,off:false,ready:false,
  track(kind,key){if(this.off||this.pend.length>200)return;this.pend.push([kind,key]);if(this.ready&&!this.timer)this.timer=setTimeout(()=>this.flush(),6000)},
  async flush(){
    this.timer=0;if(!this.ready||!DB||!ACC.uid||this.off){return}const ev=this.pend.splice(0);if(!ev.length)return;const day=todayISO();
    try{await writeDoc('events',ACC.uid,n=>{n.d=n.d||{};n.p=n.p||{};n.c=n.c||{};n.r=n.r||{};
      const dd=n.d[day]=n.d[day]||{views:0,tours:0,qr:0,ref:0,camp:0};
      ev.forEach(([k,key])=>{const px=()=>n.p[key]=n.p[key]||{views:0,tours:0};
        if(k==='view'){dd.views++;px().views++}else if(k==='tour'){dd.tours++;px().tours++}else if(k==='qr')dd.qr++;
        else if(k==='ref'){dd.ref++;n.r[key]=(n.r[key]||0)+1}else if(k==='camp'){dd.camp++;n.c[key]=(n.c[key]||0)+1}});
      const keep=Object.keys(n.d).sort().slice(-60);Object.keys(n.d).forEach(k=>{if(!keep.includes(k))delete n.d[k]});
    })}catch(e){if(e&&e.code==='invalid_argument')this.off=true}
  }};
const tracked=new Set();
const trackOnce=(key,kind,val)=>{if(tracked.has(key))return;tracked.add(key);Analytics.track(kind,val)};
/* CRMProvider (swappable: CSV export now; real CRM later) */
const CRM={name:'csv-export',async export(file,head,rows){
  const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';const csv='﻿'+[head].concat(rows).map(r=>r.map(q).join(',')).join('\r\n');
  try{const dl=window.claude&&await claude.use('downloads');if(!dl)throw 0;await dl.save({filename:file,data:csv})}catch(e){if(e&&e.code==='cancelled')return;toast('التنزيل غير متاح هنا')}}};
async function writeSetting(name,mutate){
  const run=WQ.then(async()=>{const n=JSON.parse(JSON.stringify(SETD[name]||{}));n.items=n.items||{};mutate(n.items);n.updatedAt=new Date().toISOString();await DB.doc('settings/'+name).set(n);SETD[name]=n});
  WQ=run.catch(()=>{});return run;
}
const AMB_ST={pending:'قيد المراجعة',active:'نشط',suspended:'موقوف'};
const PT_ST={new:'جديد',contacted:'تم التواصل',approved:'معتمد',rejected:'مرفوض'};
const myAmb=()=>(SETD.ambassadors.items||{})[ACC.uid];
const ambCode=()=>{const al='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let c='';do{c='';for(let i=0;i<6;i++)c+=al[Math.floor(Math.random()*al.length)]}while(Object.values(SETD.ambassadors.items||{}).some(x=>x.code===c));return c};
const srcOf=b=>b.src||'';
const bookingsAll=()=>BKV;
function sumEvt(sel){let t=0;Object.values(EVT).forEach(d=>{t+=sel(d)||0});return t}

/* ---- partners page ---- */
function fillPartners(){
  const h=$('#pt');if(!h)return;
  const pub=Object.values(SETD.partners.items||{}).filter(x=>x.public);
  let out='';
  if(pub.length)out+=`<h2 class="subh" style="margin-top:0">شركاؤنا</h2><div class="kgrid" style="margin-bottom:28px">${pub.map(x=>`<div class="ktile" style="align-items:flex-start"><div style="flex:1"><b style="display:block">${esc(x.org)}</b><small>${esc(x.type)} · ${esc((CITY[x.city]||{}).ar||'')}</small></div></div>`).join('')}</div>`;
  const say=t=>`<div class="admnote" style="margin:0">${t}</div>`;
  if(!window.claude)out+=say(NOBACK);
  else if(ACC.uid===undefined)out+=say('جارٍ التحميل…');
  else if(!ACC.uid)out+=say('سجّل الدخول إلى حسابك لتقديم طلب شراكة أو التسجيل كسفير.');
  else{
    const mine=Object.values(itemsOf(PTN[ACC.uid])).sort((x,y)=>y.createdAt.localeCompare(x.createdAt));
    const am=myAmb(),amApp=itemsOf(AMB[ACC.uid]).app;
    const inp=(id,ph,o={})=>`<input id="${id}" class="admin-in" ${o.dir?`dir="${o.dir}"`:''} placeholder="${ph}" value="${esc(FM[id]||'')}">`;
    const cities=activeCities.map(c=>`<option value="${c.slug}"${(FM['pt-city']||'dammam')===c.slug?' selected':''}>${c.ar}</option>`).join('');
    out+=`<div class="admgrid"><div class="card"><h2 style="font-size:20px">طلب شراكة</h2><div class="bkform"><select id="pt-type" class="admin-in" aria-label="نوع الشراكة">${PARTNER_TYPES.map(([t])=>`<option${(FM['pt-type']||PARTNER_TYPES[0][0])===t?' selected':''}>${t}</option>`).join('')}</select>${inp('pt-org','اسم الجهة')}<select id="pt-city" class="admin-in" aria-label="المدينة">${cities}</select>${inp('pt-contact','اسم المسؤول')}${inp('pt-phone','جوال التواصل',{dir:'ltr'})}${inp('pt-email','البريد الإلكتروني (اختياري)',{dir:'ltr'})}<textarea id="pt-msg" class="admin-in" rows="3" placeholder="كيف تتصور الشراكة؟">${esc(FM['pt-msg']||'')}</textarea></div>${FM['pt-err']?`<div class="admnote warn">${esc(FM['pt-err'])}</div>`:''}<div class="admbtns"><button class="btn btn-brand" data-act="pt-send">إرسال الطلب</button></div><p class="cap">لا يظهر اسم جهتك علنًا قبل اعتماده من الإدارة وموافقتك.</p>
      ${mine.length?`<h3 class="subh">طلباتي</h3>${mine.map(x=>`<div class="admrow"><div><b>${esc(x.org)}</b><small>${esc(x.type)} <span class="stchip st-${x.status==='approved'?'published':x.status==='rejected'?'rejected':'pending'}">${PT_ST[x.status]||x.status}</span></small>${x.reply?`<small>رد الإدارة: ${esc(x.reply)}</small>`:''}</div></div>`).join('')}`:''}</div>
    <div class="card"><h2 style="font-size:20px">برنامج السفراء</h2>${am&&am.status==='active'?ambDash(am):am&&am.status==='suspended'?'<p style="color:var(--muted)">حساب السفير موقوف. تواصل مع الإدارة.</p>':amApp?'<div class="admnote ok" style="margin:0">طلبك قيد المراجعة. عند اعتماده يظهر هنا رمزك ورابط الإحالة.</div>':`<p style="color:var(--muted);margin:4px 0 10px">انشر رابطك الخاص ويُحسب لك كل زائر يصل منه وكل طلب ينتج عنه. لا عمولات مالية في هذه النسخة؛ الإدارة تتفق معك على المكافأة خارج المنصة.</p><div class="bkform">${inp('am-name','الاسم الظاهر')}<select id="am-city" class="admin-in" aria-label="المدينة">${activeCities.map(c=>`<option value="${c.slug}"${(FM['am-city']||'dammam')===c.slug?' selected':''}>${c.ar}</option>`).join('')}</select><textarea id="am-msg" class="admin-in" rows="3" placeholder="كيف ستنشر الرابط؟ (حساباتك، مجتمعك…)">${esc(FM['am-msg']||'')}</textarea></div>${FM['am-err']?`<div class="admnote warn">${esc(FM['am-err'])}</div>`:''}<div class="admbtns"><button class="btn btn-brand" data-act="am-send">تقديم طلب سفير</button></div>`}</div></div>`;
  }
  h.innerHTML=out;
}
function ambDash(am){
  const st=STATS[ACC.uid],u=qrUrl('ref',am.code);
  return `<div class="admnote ok" style="margin:0 0 10px">أنت سفير نشط. رمزك: <b class="num">${esc(am.code)}</b></div>${qrBlockU(u,'رابط الإحالة','ref',am.code)}${st?`<ul class="verlist" style="color:var(--ink);margin-top:14px"><li>زيارات من رابطك (من حسابات مسجّلة): <b class="num">${st.clicks||0}</b></li><li>طلبات ناتجة: <b class="num">${st.requests||0}</b></li><li>طلبات مؤكدة: <b class="num">${st.confirmed||0}</b></li></ul><p class="cap">آخر تحديث للأداء: ${esc(fmtD((st.at||'').slice(0,10)))}. تنشره الإدارة دوريًا.</p>`:'<p class="cap">لم تنشر الإدارة أرقام أدائك بعد.</p>'}`;
}
function qrBlockU(url,label,kind,id){
  const s=QR.svg(url,168);
  return `<figure class="qrf"><div class="qrbox">${s||'<small>الرابط أطول من سعة الرمز</small>'}</div><figcaption><b>${label}</b><bdi class="num qru">${esc(url)}</bdi><span class="qra"><button class="btn btn-line btn-sm" data-act="copy" data-text="${esc(url)}">نسخ الرابط</button>${s?`<button class="btn btn-line btn-sm" data-act="qr-dl" data-kind="${kind}" data-id="${esc(id)}">تنزيل SVG</button>`:''}</span></figcaption></figure>`;
}
async function partnerSend(){
  const g=id=>(FM[id]!==undefined?FM[id]:(($('#'+id)||{}).value||'')).trim(),rec={id:nid(),type:g('pt-type')||PARTNER_TYPES[0][0],org:g('pt-org'),city:g('pt-city')||'dammam',contact:g('pt-contact'),phone:g('pt-phone'),email:g('pt-email'),msg:g('pt-msg').slice(0,800),status:'new',createdAt:new Date().toISOString()};
  FM['pt-err']='';
  if(rec.org.length<2)FM['pt-err']='اكتب اسم الجهة.';else if(rec.contact.length<2)FM['pt-err']='اكتب اسم المسؤول.';else if(!/^\+?[0-9\s-]{8,16}$/.test(rec.phone))FM['pt-err']='رقم الجوال غير صالح.';
  if(FM['pt-err']){fillPartners();return}
  try{await writeMine('partners',n=>{n.items[rec.id]=rec});['pt-org','pt-contact','pt-phone','pt-email','pt-msg'].forEach(k=>delete FM[k]);toast('وصل طلب الشراكة')}catch(e){FM['pt-err']=canWriteMsg(e)}
  fillPartners();
}
async function ambSend(){
  const g=id=>(FM[id]!==undefined?FM[id]:(($('#'+id)||{}).value||'')).trim(),name=g('am-name'),city=g('am-city')||'dammam',msg=g('am-msg');FM['am-err']='';
  if(name.length<2)FM['am-err']='اكتب الاسم الظاهر.';else if(msg.length<10)FM['am-err']='اشرح كيف ستنشر الرابط.';
  if(FM['am-err']){fillPartners();return}
  try{await writeMine('ambassadors',n=>{n.items.app={name:name.slice(0,40),city,msg:msg.slice(0,500),at:new Date().toISOString()}});toast('وصل طلبك')}catch(e){FM['am-err']=canWriteMsg(e)}
  fillPartners();
}

/* ---- insights (admin): analytics, partners, ambassadors, campaigns ---- */
const IN={tab:'ov'};
function viewInsights(){
  MOUNT.push(fillInsights);
  return `<section class="phead"><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <a href="#admin">لوحة الإدارة</a> / <span>التحليلات والحملات</span></div><div class="eyebrow lat" style="letter-spacing:.2em">Insights</div><h1>التحليلات والحملات</h1><p>أرقام من سجلات المنصة الفعلية. لا أرقام مختلقة.</p></div></section><section class="sec"><div class="wrap" id="ins"></div></section>`;
}
function metrics(){
  const bks=bookingsAll(),by=s=>bks.filter(b=>b.status===s).length;
  const conf=bks.filter(b=>b.status==='confirmed');
  const gmv=conf.reduce((s,b)=>s+(b.total||0),0);
  const rv=Object.values(REV).reduce((s,d)=>s+Object.values(itemsOf(d)).filter(r=>!r.hidden).length,0);
  const pend=Object.values(ACC.all).reduce((s,m)=>s+Object.values(m).filter(i=>i.status==='pending').length,0);
  const days=[];for(let i=13;i>=0;i--)days.push(addDays(todayISO(),-i));
  const series=days.map(d=>({l:d.slice(8),v:sumEvt(e=>((e.d||{})[d]||{}).views)}));
  const pv={};Object.values(EVT).forEach(e=>Object.entries(e.p||{}).forEach(([pid,x])=>{pv[pid]=pv[pid]||{views:0,tours:0};pv[pid].views+=x.views||0;pv[pid].tours+=x.tours||0}));
  const top=Object.entries(pv).filter(([pid])=>PLID[pid]).sort((x,y)=>y[1].views-x[1].views).slice(0,6);
  return {bks,by,conf,gmv,rv,pend,series,top,
    views:sumEvt(e=>Object.values(e.d||{}).reduce((s,x)=>s+(x.views||0),0)),tours:sumEvt(e=>Object.values(e.d||{}).reduce((s,x)=>s+(x.tours||0),0)),qr:sumEvt(e=>Object.values(e.d||{}).reduce((s,x)=>s+(x.qr||0),0)),ref:sumEvt(e=>Object.values(e.d||{}).reduce((s,x)=>s+(x.ref||0),0)),camp:sumEvt(e=>Object.values(e.d||{}).reduce((s,x)=>s+(x.camp||0),0)),
    users:Object.keys(EVT).length};
}
function barsHTML(series){const mx=Math.max(1,...series.map(s=>s.v));return `<div class="bars" role="img" aria-label="الزيارات اليومية لآخر 14 يومًا">${series.map(s=>`<div class="bar"><b class="num">${s.v||''}</b><i style="height:${Math.round(s.v/mx*100)}%"></i><small class="num">${s.l}</small></div>`).join('')}</div>`}
const kpi=(n,l,sub)=>`<div class="kpi"><b class="num">${n}</b><span>${l}</span>${sub?`<small>${sub}</small>`:''}</div>`;
function campStats(cid){const clicks=sumEvt(e=>(e.c||{})[cid]),r=bookingsAll().filter(b=>srcOf(b)==='camp:'+cid);return {clicks,req:r.length,conf:r.filter(b=>b.status==='confirmed').length}}
function ambStats(code){const clicks=sumEvt(e=>(e.r||{})[code]),r=bookingsAll().filter(b=>srcOf(b)==='ref:'+code);return {clicks,req:r.length,conf:r.filter(b=>b.status==='confirmed').length}}
function campTargetOpts(kind){
  if(kind==='property'||kind==='tour')return PLACES.filter(p=>kind==='property'||p.tour).map(p=>[p.id,p.name]);
  if(kind==='offer')return offersAll(true).map(o=>[o.id,o.title+' — '+(PLID[o.pid]||{}).name]);
  if(kind==='city')return activeCities.map(c=>[c.slug,c.ar]);
  if(kind==='category')return CATS.map(c=>[c.slug,c.ar]);return [];
}
function fillInsights(){
  const h=$('#ins');if(!h)return;
  {const gd=ownerGuard();if(gd)return h.innerHTML=gd}
  const tabs=[['ov','نظرة عامة'],['pt','الشركاء'],['am','السفراء'],['cm','الحملات']];
  let body='';
  if(IN.tab==='ov'){
    const m=metrics();
    body=`<div class="kpis">${kpi(LIVE?Object.keys(LIVE).length:0,'منشآت منشورة')}${kpi(m.pend,'منشآت قيد المراجعة')}${kpi(m.bks.length,'طلبات حجز/زيارة/استفسار')}${kpi(m.conf.length,'طلبات مؤكدة')}${kpi(m.rv,'تقييمات منشورة')}${kpi(Object.values(CPS).reduce((s,d)=>s+Object.values(itemsOf(d)).filter(c=>c.status!=='resolved').length,0),'شكاوى مفتوحة')}</div>
    <div class="admgrid" style="margin-top:20px"><div class="card"><h2 style="font-size:20px">قيمة الطلبات المؤكدة (تقديرية)</h2><div class="kpi" style="margin-top:8px"><b class="num">${fmt(m.gmv)}</b><span>ر.س — إجمالي قيمة الحجوزات (GMV)</span></div><p class="cap">هذا ليس إيرادًا للمنصة. الإيراد الفعلي هو الاشتراكات والعمولة بعد تحصيلها، ولا يُحتسب قبل تفعيل الدفع. تُحسب من إجمالي الحجوزات المؤكدة ذات السعر المحدد.</p></div>
    <div class="card"><h2 style="font-size:20px">التفاعل (عينة)</h2><div class="kpis k2">${kpi(m.views,'مشاهدات صفحات')}${kpi(m.tours,'فتح جولات')}${kpi(m.qr,'دخول عبر QR')}${kpi(m.ref+m.camp,'زيارات إحالة/حملات')}</div><p class="cap">تُسجَّل الأحداث من الحسابات المسجّلة التي تملك صلاحية الكتابة فقط (${m.users} حساب حتى الآن)، فهي عيّنة وليست كل الزوار. قياس كل الزوار يحتاج خدمة تحليلات على الاستضافة الفعلية.</p></div></div>
    <div class="card" style="margin-top:20px"><h2 style="font-size:20px">مشاهدات آخر 14 يومًا</h2>${m.views?barsHTML(m.series):'<p style="color:var(--muted)">لا توجد أحداث مسجّلة بعد.</p>'}</div>
    <div class="card" style="margin-top:20px"><h2 style="font-size:20px">أكثر المنشآت مشاهدة (عينة)</h2>${m.top.length?m.top.map(([pid,x])=>`<div class="admrow"><div><b>${esc(PLID[pid].name)}</b><small>${esc(CITY[PLID[pid].city].ar)} · ${esc(CAT[PLID[pid].cat].ar)}</small></div><div class="num">${x.views} مشاهدة · ${x.tours} جولة</div></div>`).join(''):'<p style="color:var(--muted)">لا توجد بيانات بعد.</p>'}</div>`;
  }else if(IN.tab==='pt'){
    const rows=[];Object.entries(PTN).forEach(([uid,d])=>Object.values(itemsOf(d)).forEach(x=>rows.push([uid,x])));rows.sort((x,y)=>y[1].createdAt.localeCompare(x[1].createdAt));
    body=`<div class="card"><h2 style="font-size:20px">طلبات الشراكة <span class="num" style="color:var(--muted);font-size:15px">(${rows.length})</span></h2>${rows.length?rows.map(([uid,x])=>{const pubd=((SETD.partners.items||{})[x.id]||{}).public;return `<div class="admrow"><div><b>${esc(x.org)}</b><small>${esc(x.type)} · ${esc((CITY[x.city]||{}).ar||'')} <span class="stchip st-${x.status==='approved'?'published':x.status==='rejected'?'rejected':'pending'}">${PT_ST[x.status]||x.status}</span>${pubd?' <span class="stchip st-published">معروض علنًا</span>':''}</small><small>${esc(x.contact)} · <bdi class="num">${esc(x.phone)}</bdi>${x.email?' · '+esc(x.email):''}</small><small>${esc(x.msg||'')}</small>${x.reply?`<small>ردّك: ${esc(x.reply)}</small>`:''}</div><div class="admact"><input id="ptn-${x.id}" class="admin-in" style="width:140px;padding:7px 10px" placeholder="ملاحظة / رد"><button class="btn btn-line btn-sm" data-act="ptm" data-k="contacted" data-uid="${uid}" data-id="${x.id}">تم التواصل</button><button class="btn btn-brand btn-sm" data-act="ptm" data-k="approved" data-uid="${uid}" data-id="${x.id}">اعتماد</button><button class="btn btn-line btn-sm" data-act="ptm" data-k="${pubd?'unpub':'pub'}" data-uid="${uid}" data-id="${x.id}">${pubd?'إخفاء من العرض':'عرض علنًا'}</button><button class="btn btn-line btn-sm danger" data-act="ptm" data-k="rejected" data-uid="${uid}" data-id="${x.id}">رفض</button></div></div>`}).join(''):'<p style="color:var(--muted)">لا توجد طلبات.</p>'}${rows.length?`<div class="admbtns"><button class="btn btn-line btn-sm" data-act="csv-pt">تصدير CSV (CRM)</button></div>`:''}<p class="cap">لا يظهر اسم أي جهة علنًا إلا بعد اعتمادها وتفعيل «عرض علنًا» بموافقتها.</p></div>`;
  }else if(IN.tab==='am'){
    const apps=[];Object.entries(AMB).forEach(([uid,d])=>{const ap=itemsOf(d).app;if(ap)apps.push([uid,ap])});
    const sa=SETD.ambassadors.items||{};
    body=`<div class="card"><h2 style="font-size:20px">السفراء <span class="num" style="color:var(--muted);font-size:15px">(${apps.length})</span></h2>${apps.length?apps.map(([uid,ap])=>{const s=sa[uid],st=s?ambStats(s.code):null;return `<div class="admrow"><div><b>${esc(ap.name)}</b><small>${esc((CITY[ap.city]||{}).ar||'')} <span class="stchip st-${s&&s.status==='active'?'published':s?'unpublished':'pending'}">${s?AMB_ST[s.status]:AMB_ST.pending}</span>${s?` · الرمز <b class="num">${esc(s.code)}</b>`:''}</small><small>${esc(ap.msg||'')}</small>${st?`<small>زيارات (عينة): <span class="num">${st.clicks}</span> · طلبات: <span class="num">${st.req}</span> · مؤكدة: <span class="num">${st.conf}</span></small>`:''}</div><div class="admact">${!s?`<button class="btn btn-brand btn-sm" data-act="amm" data-k="ok" data-uid="${uid}">اعتماد</button>`:s.status==='active'?`<button class="btn btn-line btn-sm danger" data-act="amm" data-k="off" data-uid="${uid}">إيقاف</button>`:`<button class="btn btn-line btn-sm" data-act="amm" data-k="on" data-uid="${uid}">تفعيل</button>`}</div></div>`}).join(''):'<p style="color:var(--muted)">لا توجد طلبات سفراء.</p>'}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="amm-pub">نشر الأداء للسفراء النشطين</button>${apps.length?'<button class="btn btn-line btn-sm" data-act="csv-am">تصدير CSV</button>':''}</div><p class="cap">يرى كل سفير أرقامه بعد أن تنشرها له. الزيارات عيّنة من الحسابات المسجّلة؛ الطلبات من سجلات الحجز الفعلية.</p></div>`;
  }else{
    const camps=Object.entries(SETD.campaigns.items||{}),bud=itemsOf(CMPB.budgets),kind=FM['cm-kind']||'property',opts=campTargetOpts(kind);
    const KINDS={property:'صفحة منشأة',tour:'جولة منشأة',offer:'عرض',city:'مدينة',category:'تصنيف',home:'الرئيسية'};
    body=`<div class="admgrid"><div class="card"><h2 style="font-size:20px">حملة جديدة</h2>${fld('cm-name','اسم الحملة',FM['cm-name']||'')}<label class="admlbl" for="cm-kind">الوجهة</label><select id="cm-kind" class="admin-in">${Object.entries(KINDS).map(([k,t])=>`<option value="${k}"${k===kind?' selected':''}>${t}</option>`).join('')}</select>${kind!=='home'?`<select id="cm-target" class="admin-in" style="margin-top:8px" aria-label="الهدف">${opts.map(([v,t])=>`<option value="${esc(v)}"${FM['cm-target']===v?' selected':''}>${esc(t)}</option>`).join('')}</select>`:''}<div class="fgrid">${fld('cm-from','تبدأ',FM['cm-from']||todayISO(),{type:'date'})}${fld('cm-to','تنتهي',FM['cm-to']||addDays(todayISO(),30),{type:'date'})}${fld('cm-channel','القناة (مطبوع، إنستغرام…)',FM['cm-channel']||'')}${fld('cm-budget','الميزانية (ر.س) — خاصة بك',FM['cm-budget']||'',{type:'number'})}</div>${FM['cm-err']?`<div class="admnote warn">${esc(FM['cm-err'])}</div>`:''}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="cm-save">إنشاء الحملة</button></div><p class="cap">الميزانية تُحفظ في مكان خاص بالإدارة ولا تظهر للزوار.</p></div>
    <div class="card"><h2 style="font-size:20px">الحملات <span class="num" style="color:var(--muted);font-size:15px">(${camps.length})</span></h2>${camps.length?camps.map(([cid,c])=>{const st=campStats(cid),u=qrUrl('camp',cid);return `<div class="admrow" style="align-items:flex-start"><div><b>${esc(c.name)}</b><small>${esc(KINDS[c.kind]||c.kind)} · ${esc(fmtD(c.from))} ← ${esc(fmtD(c.to))} ${c.active?'<span class="stchip st-published">فعّالة</span>':'<span class="stchip st-unpublished">متوقفة</span>'}</small><small>${esc(c.channel||'')}${(bud[cid]||{}).budget?' · الميزانية <span class="num">'+fmt(bud[cid].budget)+'</span> ر.س':''}</small><small>زيارات (عينة): <span class="num">${st.clicks}</span> · طلبات: <span class="num">${st.req}</span> · مؤكدة: <span class="num">${st.conf}</span></small>${qrBlockU(u,'رابط الحملة','camp',cid)}</div><div class="admact"><button class="btn btn-line btn-sm" data-act="cmm" data-k="tog" data-id="${cid}">${c.active?'إيقاف':'تفعيل'}</button><button class="btn btn-line btn-sm danger" data-act="cmm" data-k="del" data-id="${cid}">حذف</button></div></div>`}).join(''):'<p style="color:var(--muted)">لا توجد حملات.</p>'}${camps.length?`<div class="admbtns"><button class="btn btn-line btn-sm" data-act="csv-cm">تصدير CSV</button></div>`:''}</div></div>`;
  }
  h.innerHTML=`<div class="tabs" role="tablist">${tabs.map(([k,t])=>`<button role="tab" aria-selected="${IN.tab===k}" data-act="in-tab" data-t="${k}">${t}</button>`).join('')}</div><div style="margin-top:20px">${body}</div>`;
}
async function ptModerate(k,uid,id){
  if(!CAN)return;const note=(($('#ptn-'+id)||{}).value||'').trim(),x=itemsOf(PTN[uid])[id];if(!x)return;
  try{
    if(k==='pub'||k==='unpub'){await writeSetting('partners',it=>{if(k==='unpub'){if(it[id])it[id].public=false}else it[id]={org:x.org,type:x.type,city:x.city,public:true,at:new Date().toISOString()}});toast(k==='pub'?'ظهرت الجهة علنًا':'أُخفيت من العرض')}
    else{await writeDoc('partners',uid,n=>{const r=n.items[id];if(r){r.status=k;if(note)r.reply=note}});if(k==='rejected')await writeSetting('partners',it=>{if(it[id])it[id].public=false});toast('تم التحديث')}
  }catch(e){toast('تعذّر الإجراء')}
}
async function ambModerate(k,uid){
  if(!CAN)return;const ap=itemsOf(AMB[uid]).app;if(!ap)return;
  try{await writeSetting('ambassadors',it=>{if(k==='ok')it[uid]={code:ambCode(),name:ap.name,city:ap.city,status:'active',at:new Date().toISOString()};else if(it[uid])it[uid].status=k==='off'?'suspended':'active'});toast('تم التحديث')}catch(e){toast('تعذّر الإجراء')}
}
async function ambPublish(){
  if(!CAN)return;const sa=SETD.ambassadors.items||{},act=Object.entries(sa).filter(([,s])=>s.status==='active');if(!act.length){toast('لا يوجد سفراء نشطون');return}
  try{for(const [uid,s] of act){const st=ambStats(s.code);await DB.doc('stats/'+uid).set({clicks:st.clicks,requests:st.req,confirmed:st.conf,at:new Date().toISOString()})}toast('نُشر أداء '+act.length+' سفير')}catch(e){toast('تعذّر النشر')}
}
async function campCreate(){
  if(!CAN)return;const g=id=>(FM[id]!==undefined?FM[id]:(($('#'+id)||{}).value||'')).trim();
  const kind=g('cm-kind')||'property',name=g('cm-name'),target=kind==='home'?'':(($('#cm-target')||{}).value||FM['cm-target']||''),from=g('cm-from')||todayISO(),to=g('cm-to'),channel=g('cm-channel'),budget=g('cm-budget');FM['cm-err']='';
  if(name.length<3)FM['cm-err']='اكتب اسم الحملة.';else if(kind!=='home'&&!target)FM['cm-err']='اختر الهدف.';else if(!to||to<from)FM['cm-err']='تاريخ الانتهاء يجب أن يكون بعد البداية.';
  if(FM['cm-err']){fillInsights();return}
  const cid='c'+nid();
  try{await writeSetting('campaigns',it=>{it[cid]={name:name.slice(0,60),kind,target,from,to,channel:channel.slice(0,60),active:true,at:new Date().toISOString()}});
    if(budget!==''&&Number(budget)>=0)await writeDoc('campaigns','budgets',n=>{n.items[cid]={budget:Number(budget)}});
    ['cm-name','cm-channel','cm-budget'].forEach(k=>delete FM[k]);toast('أُنشئت الحملة')}catch(e){FM['cm-err']='تعذّر الحفظ.'}
  fillInsights();
}
function csvPartners(){const r=[];Object.entries(PTN).forEach(([uid,d])=>Object.values(itemsOf(d)).forEach(x=>r.push([x.org,x.type,(CITY[x.city]||{}).ar||'',x.contact,x.phone,x.email,PT_ST[x.status]||x.status,x.createdAt])));CRM.export('partners.csv',['الجهة','النوع','المدينة','المسؤول','الجوال','البريد','الحالة','التاريخ'],r)}
function csvAmb(){const sa=SETD.ambassadors.items||{},r=Object.entries(sa).map(([uid,s])=>{const st=ambStats(s.code);return [s.name,(CITY[s.city]||{}).ar||'',s.code,AMB_ST[s.status],st.clicks,st.req,st.conf]});CRM.export('ambassadors.csv',['الاسم','المدينة','الرمز','الحالة','زيارات','طلبات','مؤكدة'],r)}
function csvCamp(){const bud=itemsOf(CMPB.budgets),r=Object.entries(SETD.campaigns.items||{}).map(([cid,c])=>{const st=campStats(cid);return [c.name,c.kind,c.target,c.from,c.to,c.channel,(bud[cid]||{}).budget||'',st.clicks,st.req,st.conf]});CRM.export('campaigns.csv',['الحملة','الوجهة','الهدف','من','إلى','القناة','الميزانية','زيارات','طلبات','مؤكدة'],r)}

/* ---------- SEO: per-route head, canonical, Open Graph, JSON-LD ---------- */
function siteUrl(){
  const m=document.querySelector('meta[name="jw-site"]'),v=(window.JW_CONFIG&&JW_CONFIG.siteUrl)||(m&&m.content&&!/^__/.test(m.content)?m.content:'');
  return (v||location.origin).replace(/\/+$/,'');
}
function upMeta(attr,key,val){
  let el=document.head.querySelector(`meta[${attr}="${key}"]`);
  if(val==null||val===''){if(el)el.remove();return}
  if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.appendChild(el)}
  el.setAttribute('content',val);
}
function setHead(raw,name,arg){
  const SN='جولات 360',base=siteUrl();let t=SN+' — اكتشف المكان قبل ما تروح له',d='استكشف الأماكن والتجارب من حولك، وشاهدها بجولة 360° قبل زيارتها.',robots='index,follow',ld=[],crumbs=null,ogType='website';
  const T={explore:['اكتشف الأماكن','تصفّح الأماكن في الدمام والخبر والظهران والرياض وجدة مع فلاتر وخريطة.'],tours:['جولات 360°','جولات 360° للأماكن قبل زيارتها.'],map:['خريطة الأماكن','اعرض الأماكن على الخريطة حسب المدينة والتصنيف.'],cities:['المدن','المدن المتاحة على جولات 360 وأماكنها.'],categories:['التصنيفات','تصنيفات الأماكن: شاليهات وفنادق ومطاعم ومقاهٍ وغيرها.'],articles:['المقالات','مقالات ودلائل عن الوجهات والتجارب.'],partners:['شركاء جولات 360','طلبات الشراكة وبرنامج السفراء.'],offers:['العروض','عروض سارية من أصحاب المنشآت.']};
  if(name==='home'){ld.push({'@context':'https://schema.org','@type':'WebSite',name:SN,url:base+'/',inLanguage:'ar',potentialAction:{'@type':'SearchAction',target:base+'/explore?q={search_term_string}','query-input':'required name=search_term_string'}},{'@context':'https://schema.org','@type':'Organization',name:SN,url:base+'/',logo:base+'/icons/icon-512.png'})}
  else if(T[name]){t=T[name][0]+' | '+SN;d=T[name][1];if(name==='map'||name==='offers'||name==='partners')robots='index,follow'}
  else if(name==='city'&&CITY[arg]){const c=CITY[arg];t=`${c.ar} — أماكن وجولات 360° | ${SN}`;d=(c.about||'').slice(0,155)||`اكتشف أماكن ${c.ar} بجولات 360°.`;if(!c.active)robots='noindex,follow';crumbs=[['الرئيسية','home'],['المدن','cities'],[c.ar,raw]]}
  else if(name==='category'&&CAT[arg]){const c=CAT[arg];t=`${c.ar} في السعودية | ${SN}`;d=(c.desc||'').slice(0,155);crumbs=[['الرئيسية','home'],['التصنيفات','categories'],[c.ar,raw]]}
  else if(name==='place'&&PL[arg]){const p=PL[arg],c=CAT[p.cat],ci=CITY[p.city];t=`${p.name} — ${c.ar} في ${ci.ar} | ${SN}`;d=(p.short||'').slice(0,155);ogType='article';crumbs=[['الرئيسية','home'],[ci.ar,'city-'+ci.slug],[c.ar,'category-'+c.slug],[p.name,raw]];
    if(isDemo(p))robots='noindex,follow';
    else{const o={'@context':'https://schema.org','@type':'LocalBusiness',name:p.name,description:p.short,url:base+rawToHref(raw),address:{'@type':'PostalAddress',addressLocality:ci.ar,addressCountry:'SA'}};if(p.phone)o.telephone=p.phone;if(!p.approxLoc)o.geo={'@type':'GeoCoordinates',latitude:p.lat,longitude:p.lng};if(p.reviewCount)o.aggregateRating={'@type':'AggregateRating',ratingValue:p.rating,reviewCount:p.reviewCount};ld.push(o)}}
  else if(name==='article'){const x=ARTICLES.find(y=>y.slug===arg);if(x){t=`${x.ar} | ${SN}`;d=(x.lead||d).toString().slice(0,155);robots='noindex,follow'}}
  else if(!VIEWS[name]||['admin','account','insights','go','bookings'].includes(name)){robots='noindex,nofollow';t=(name==='account'?'حسابي':name==='bookings'?'حجوزاتي':name==='admin'||name==='insights'?'الإدارة':'الصفحة غير موجودة')+' | '+SN}
  if(crumbs)ld.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map(([n,r],i)=>({'@type':'ListItem',position:i+1,name:n,item:base+rawToHref(r==='home'?'home':r)}))});
  if(PATHMODE&&!(window.JW_CONFIG&&JW_CONFIG.allowIndexing))robots='noindex,nofollow';
  document.title=t;
  upMeta('name','description',d);upMeta('name','robots',robots);
  upMeta('property','og:title',t);upMeta('property','og:description',d);upMeta('property','og:type',ogType);upMeta('property','og:locale','ar_SA');upMeta('property','og:site_name',SN);
  upMeta('name','twitter:card','summary_large_image');
  let cl=document.head.querySelector('link[rel=canonical]');
  if(PATHMODE){const url=base+rawToHref(raw);if(!cl){cl=document.createElement('link');cl.rel='canonical';document.head.appendChild(cl)}cl.href=url;upMeta('property','og:url',url);upMeta('property','og:image',base+'/og.png')}
  let s=document.getElementById('jw-ld');
  if(ld.length&&PATHMODE){if(!s){s=document.createElement('script');s.type='application/ld+json';s.id='jw-ld';document.head.appendChild(s)}s.textContent=JSON.stringify(ld.length===1?ld[0]:ld)}else if(s)s.remove();
}

/* ---------- router ---------- */
const ui={preset:null};
const VIEWS={home:viewHome,explore:viewExplore,cities:viewCities,city:viewCity,categories:viewCategories,category:viewCategory,place:viewPlace,tours:viewTours,map:viewMap,articles:viewArticles,article:viewArticle,partners:viewPartners,admin:viewAdmin,go:viewGo,account:viewAccount,bookings:viewBookings,offers:viewOffers,insights:viewInsights};

/* ---------- dual-mode router: #hash inside the preview, real paths on hosting ---------- */
const PATHMODE=(()=>{const m=document.querySelector('meta[name="jw-router"]');return !!m&&m.content==='path'})();
const NOBACK=PATHMODE?'هذه الميزة تحتاج ربط قاعدة البيانات (Supabase). راجع ملف README المرفق.':'متاح من رابط المنصة فقط.';
const LOGIN_HINT=()=>PATHMODE?'سجّل الدخول من زر «دخول» أعلى الصفحة.':'سجّل الدخول إلى حسابك على claude.ai.';
const splitRaw=r=>{const i=r.indexOf('-');return i<0?[r,'']:[r.slice(0,i),r.slice(i+1)]};
function curRaw(){
  if(PATHMODE){const p=decodeURIComponent(location.pathname).replace(/^\/+|\/+$/g,'');if(!p||p==='index.html')return 'home';const i=p.indexOf('/');return i<0?p:p.slice(0,i)+'-'+p.slice(i+1)}
  return decodeURIComponent((location.hash||'').slice(1))||'home';
}
function rawToHref(raw){if(!PATHMODE)return '#'+raw;if(raw==='home')return '/';const [n,r]=splitRaw(raw);return '/'+n+(r?'/'+encodeURI(r):'')}
function hrefToRaw(href){
  if(href[0]==='#')return href.slice(1);
  try{const u=new URL(href,location.origin);if(u.origin!==location.origin)return null;const p=decodeURIComponent(u.pathname).replace(/^\/+|\/+$/g,'');if(!p)return 'home';const i=p.indexOf('/');return i<0?p:p.slice(0,i)+'-'+p.slice(i+1)}catch(e){return null}
}
function navTo(raw,replace){
  if(!PATHMODE){if(replace)location.replace('#'+raw);else location.hash=raw;return}
  const u=rawToHref(raw);if(replace)history.replaceState(null,'',u);else history.pushState(null,'',u);route();
}
const knownRoute=raw=>!!raw&&!!VIEWS[splitRaw(raw)[0]];
function fixLinks(root){if(!PATHMODE)return;root.querySelectorAll('a[href^="#"]').forEach(a=>{const r=a.getAttribute('href').slice(1);if(knownRoute(r))a.setAttribute('href',rawToHref(r))})}
if(PATHMODE){let fq=0;new MutationObserver(()=>{if(fq)return;fq=requestAnimationFrame(()=>{fq=0;fixLinks(app)})}).observe(app,{childList:true,subtree:true})}
function go(h,preset){ui.preset=preset||null;if(curRaw()===h)route();else navTo(h)}
function route(){
  closeOverlays();
  const raw=curRaw();
  const [name,arg]=splitRaw(raw);
  let preset=ui.preset;ui.preset=null;
  if(PATHMODE&&name==='explore'&&!preset){const q=new URLSearchParams(location.search).get('q');if(q)preset={q:q.slice(0,80)}}
  for(const k in LST)delete LST[k];MOUNT.length=0;
  const v=VIEWS[name]||viewNotFound;
  let html;try{html=v(arg,preset)}catch(err){console.error(err);html=viewNotFound()}
  app.innerHTML=chrome(VIEWS[name]?name:'',html);
  fixLinks(app);
  MOUNT.forEach(f=>f());
  setHead(raw,name,arg);
  window.scrollTo(0,0);
  if(name==='place'&&PL[arg])trackOnce('v-'+PL[arg].id,'view',PL[arg].id);
  tryPending();
}
if(PATHMODE)window.addEventListener('popstate',route);else window.addEventListener('hashchange',route);

/* ==BOOK-BEGIN== */
/* ---------- Phase 7: customer accounts, direct booking, owner booking management, WhatsApp ----------
   - Hosted (Vercel + Supabase): window.JW_BOOK (backend.js) talks to RPC functions; the SERVER computes the price and status.
   - Preview (claude.ai artifact): the same UI runs on shared documents; the price is computed in the browser (labelled), and the owner
     view flags any booking whose price differs from the saved settings. */
const BTYPES={
  stay:{t:'احجز إقامتك',l:'إقامة — فنادق وشاليهات واستراحات',date:'range',qty:'عدد الأشخاص',units:['night','flat','free','inquiry'],unit:'night',qmax:20},
  ticket:{t:'احجز تذكرتك',l:'تذاكر وزيارة — متاحف ومعارض ومراكز ترفيه',date:'one',qty:'عدد التذاكر',units:['ticket','flat','free','inquiry'],unit:'ticket',qmax:20},
  table:{t:'احجز طاولة',l:'حجز طاولة — مطاعم ومقاهٍ',date:'one',time:true,qty:'عدد الأشخاص',units:['free','flat','inquiry'],unit:'free',qmax:20},
  appointment:{t:'احجز موعدًا',l:'موعد — مستشفيات وعيادات',date:'one',time:true,qty:null,svc:true,units:['flat','free','inquiry'],unit:'flat',qmax:1},
  service:{t:'أرسل طلبك',l:'طلب خدمة أو استفسار',date:null,qty:null,units:['inquiry','flat','free'],unit:'inquiry',qmax:1}};
const BUNITS={ticket:'سعر التذكرة',night:'سعر الليلة',flat:'سعر الخدمة (مرة واحدة)',free:'مجاني',inquiry:'بالاستفسار فقط (إخفاء السعر)'};
const MODE_BT={booking:'stay','request-visit':'ticket',reservation:'table',appointment:'appointment',inquiry:'service',quote:'service'};
const BST={new:'جديد',pending:'بانتظار الموافقة',confirmed:'مؤكد',rejected:'مرفوض',cancelled:'ملغي',completed:'مكتمل'};
const BST_CLS={new:'pending',pending:'pending',confirmed:'published',rejected:'rejected',cancelled:'unpublished',completed:'published'};
const bstChip=s=>`<span class="stchip st-${BST_CLS[s]||'pending'}">${esc(BST[s]||s)}</span>`;
const BKERR={AUTH_REQUIRED:'سجّل الدخول أولًا.',PLACE_NOT_FOUND:'المنشأة غير متاحة.',BOOKING_DISABLED:'الحجز غير مفعّل لهذه المنشأة.',BAD_CONFIG:'إعدادات الحجز غير مكتملة، تواصل مع الإدارة.',NAME_REQUIRED:'اكتب الاسم الكامل.',BAD_PHONE:'رقم الجوال غير صالح.',DATE_REQUIRED:'اختر التاريخ.',DATE_IN_PAST:'لا يمكن الحجز في تاريخ مضى.',DATE_TOO_FAR:'التاريخ بعيد جدًا.',BAD_DATE_RANGE:'تاريخ المغادرة يجب أن يكون بعد الوصول (حتى 60 ليلة).',QTY_REQUIRED:'اكتب العدد.',QTY_OUT_OF_RANGE:'العدد خارج الحد المسموح لهذه المنشأة.',SLOT_REQUIRED:'اختر الفترة أو الوقت المتاح.',SERVICE_REQUIRED:'اختر الخدمة.',EXTRA_REQUIRED:'أكمل الحقول المطلوبة.',PRICE_NOT_SET:'سعر هذه المنشأة غير مكتمل، تواصل مع الإدارة.',DATES_UNAVAILABLE:'الفترة المطلوبة غير متاحة. اختر تاريخًا آخر.',PHONE_NOT_VERIFIED:'يجب التحقق من رقم الجوال أولًا (أو انتهت صلاحية التحقق).',RATE_LIMIT:'محاولات كثيرة. حاول بعد قليل.',FORBIDDEN:'غير مصرح.',NOT_FOUND:'الطلب غير موجود.',NOT_CANCELLABLE:'لا يمكن إلغاء هذا الحجز.',REPLY_REQUIRED:'اكتب سبب الرفض.',SMS_NOT_CONFIGURED:'خدمة الرسائل النصية غير مفعّلة بعد.',BAD_STATUS:'حالة غير صالحة.'};
const bkErr=e=>{const m=String((e&&e.message)||e||'');const k=Object.keys(BKERR).find(x=>m.includes(x));return k?BKERR[k]:'تعذّر تنفيذ الطلب، حاول مرة أخرى.'};
function normPhone(p){let d=String(p||'').replace(/\D/g,'');if(d.startsWith('00'))d=d.slice(2);if(/^05\d{8}$/.test(d))d='966'+d.slice(1);else if(/^5\d{8}$/.test(d))d='966'+d;return /^\d{10,15}$/.test(d)?d:null}

/* ---- state ---- */
let BKV=[],BOOKED_X={};
const BK={pid:null,y:0,m:0,a:'',b:'',err:'',busy:false,step:'form',F:{},otp:null,otpBusy:false,verified:'',res:null};
const BF={q:'',status:'',pid:'',from:'',to:''},BKX=new Set(),BS={pid:'',d:null,err:''};
const BOOKAPI={get hosted(){return !!window.JW_BOOK}};
const bkcfg=pid=>{const c=((SETD.booking||{}).items||{})[pid];return c&&c.enabled?c:null};
const bkcfgAny=pid=>((SETD.booking||{}).items||{})[pid]||null;
const bk2Eligible=p=>!!p&&!isDemo(p)&&!!bkcfg(p.id);
const btypeOf=cfg=>BTYPES[cfg&&cfg.type]||BTYPES.service;

/* ---- price: the same rules the server applies (server value is the one stored) ---- */
function bkCalc(cfg,F,from,to){
  const T=btypeOf(cfg),pr=cfg.pricing||{},u=pr.unit||'inquiry';
  let price=(pr.price===undefined||pr.price===null||pr.price==='')?null:Number(pr.price);
  const sv=(cfg.services||[]).find(s=>s.n===F.service);
  if(sv&&sv.p!==undefined&&sv.p!==null&&sv.p!==''&&u!=='free'&&u!=='inquiry')price=Number(sv.p);
  const nights=T.date==='range'&&from&&to?Math.max(0,nightsBetween(from,to)):0,qty=T.qty?(Math.floor(+F.qty)||0):1;
  let total=null;
  if(u==='ticket')total=price==null?null:price*qty;else if(u==='night')total=price==null?null:price*nights;else if(u==='flat')total=price;else if(u==='free')total=0;
  return {unit:u,price:u==='free'?0:u==='inquiry'?null:price,nights,qty,total};
}
function bkLines(c){
  if(c.unit==='inquiry')return ['السعر بالاستفسار — تحدده الإدارة بعد مراجعة الطلب'];
  if(c.unit==='free')return ['حجز مجاني'];
  if(c.price==null)return ['السعر غير محدد'];
  const p=fmt(c.price)+' ر.س';
  if(c.unit==='ticket')return [`${p} × ${c.qty||0} تذكرة`];
  if(c.unit==='night')return [`${p} × ${c.nights||0} ليلة`];
  return [`${p} (للخدمة)`];
}
const bkTotalTxt=c=>c.total==null?'بالاستفسار':c.total===0?'مجاني':fmt(c.total)+' ر.س';

/* ---- adapter: hosted (server) or preview (shared documents) ---- */
const LOCOTP={};
function secureCode(){const a=new Uint32Array(1);(window.crypto||{getRandomValues:x=>{x[0]=Math.floor(Math.random()*4294967296)}}).getRandomValues(a);return String(a[0]%1000000).padStart(6,'0')}
const genCode=()=>{const d=new Date(),al='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=al[Math.floor(Math.random()*al.length)];return 'JW-'+String(d.getFullYear()).slice(2)+pad2(d.getMonth()+1)+'-'+s};
function legacyToV(uid,b){
  if(b.v===2)return Object.assign({uid},b);
  const bt=MODE_BT[b.mode]||'service';
  return {v:1,id:b.id,code:'قديم-'+String(b.id).slice(-5).toUpperCase(),uid,pid:b.pid,pname:b.pname||'',cat:'',btype:bt,name:b.name||'',email:'',phone:b.phone||'',from:b.from||'',to:b.to||'',nights:b.nights||0,qty:b.guests||1,slot:b.time||'',service:'',extra:{},note:b.note||'',unit:b.total?'night':'inquiry',price:null,total:b.total==null?null:b.total,instant:false,pv:'none',status:b.status==='requested'?'pending':b.status==='declined'?'rejected':b.status,cancelReq:false,reply:b.reply||'',createdAt:b.createdAt||'',src:b.src||''};
}
function bkvFromDocs(){const o=[];Object.entries(BKS).forEach(([uid,d])=>Object.values(itemsOf(d)).forEach(b=>o.push(legacyToV(uid,b))));return o.sort((x,y)=>(y.createdAt||'').localeCompare(x.createdAt||''))}
async function bkLoad(){
  if(!BOOKAPI.hosted||!ACC.uid)return;
  try{BKV=await JW_BOOK.list();sync()}catch(e){/* ignore: next poll */}
}
async function bkLoadBooked(pid){
  if(!BOOKAPI.hosted)return;
  try{const a=await JW_BOOK.booked(pid);const j=JSON.stringify(a);if(JSON.stringify(BOOKED_X[pid]||[])!==j){BOOKED_X[pid]=a;const p=PLID[pid];if(p&&$('#bk'))fillBooking(p)}}catch(e){}
}
const bookedAll=pid=>{const s=bookedSet(pid);(BOOKED_X[pid]||[]).forEach(d=>s.add(d));return s};

const ART={
  async otpRequest(phone){
    const ph=normPhone(phone);if(!ph)throw new Error('BAD_PHONE');
    const now=Date.now(),o=LOCOTP[ph]||(LOCOTP[ph]={hist:[]});o.hist=o.hist.filter(t=>now-t<36e5);if(o.hist.length>=6)throw new Error('RATE_LIMIT');o.hist.push(now);
    Object.assign(o,{code:secureCode(),exp:now+3e5,tries:0,ok:false,used:false});
    return {mode:'demo',code:o.code,expires_in:300};
  },
  async otpVerify(phone,code){const ph=normPhone(phone),o=ph&&LOCOTP[ph];if(!o||!o.code||o.used||Date.now()>o.exp||o.tries>=5||!/^\d{6}$/.test(code))return false;o.tries++;if(o.code===code){o.ok=true;o.vat=Date.now();return true}return false},
  async create(pid,pl){
    const p=PLID[pid],cfg=bkcfg(pid);if(!p||!cfg)throw new Error('BOOKING_DISABLED');
    const ph=normPhone(pl.phone),o=ph&&LOCOTP[ph];if(!o||!o.ok||o.used||Date.now()-o.vat>18e5)throw new Error('PHONE_NOT_VERIFIED');
    const T=btypeOf(cfg),c=bkCalc(cfg,pl,pl.from,pl.to);
    if(T.date==='range'&&nightList(pl.from,pl.to).find(d=>bookedAll(pid).has(d)||blockedSet(pid).has(d)))throw new Error('DATES_UNAVAILABLE');
    const inst=cfg.type==='stay'&&!!cfg.instant,status=inst?'confirmed':c.unit==='inquiry'?'new':'pending';
    const rec={v:2,id:nid(),code:genCode(),uid:ACC.uid,pid,pname:p.name,cat:p.cat,btype:cfg.type,name:pl.name,email:'',phone:ph,from:pl.from||'',to:T.date==='range'?pl.to:(pl.from||''),nights:c.nights,qty:c.qty,slot:pl.slot||'',service:pl.service||'',extra:pl.extra||{},note:pl.note||'',unit:c.unit,price:c.price,total:c.total,instant:inst,pv:'demo',status,cancelReq:false,reply:'',createdAt:new Date().toISOString(),src:srcTag()};
    await writeMine('bookings',n=>{n.items[rec.id]=rec});o.used=true;
    if(inst&&cfg.type==='stay')await ART.avail(rec,true);
    return {id:rec.id,code:rec.code,status,total:c.total,nights:c.nights};
  },
  async avail(rec,on){
    if(rec.btype!=='stay'||!rec.from||!rec.to)return;const days=nightList(rec.from,rec.to);
    await writeDoc('availability','confirmed',n=>{const it=n.items[rec.pid]=n.items[rec.pid]||{booked:[],count:0};
      if(on){it.booked=Array.from(new Set(it.booked.concat(days))).sort();it.count=(it.count||0)+1}
      else{const rm=new Set(days);it.booked=(it.booked||[]).filter(d=>!rm.has(d));it.count=Math.max(0,(it.count||0)-1)}});
  },
  async cancel(v){
    if(v.status==='new'||v.status==='pending'){await writeDoc('bookings',v.uid,n=>{const b=n.items[v.id];if(b){b.status='cancelled';b.decidedAt=new Date().toISOString()}});return {status:'cancelled'}}
    if(v.status==='confirmed'){await writeDoc('bookings',v.uid,n=>{const b=n.items[v.id];if(b)b.cancelReq=true});return {status:'confirmed',cancel_requested:true}}
    throw new Error('NOT_CANCELLABLE');
  },
  async setStatus(v,status,reply){
    if(!CAN)throw new Error('FORBIDDEN');
    if(status==='rejected'&&!reply)throw new Error('REPLY_REQUIRED');
    if(status==='confirmed'&&v.btype==='stay'&&v.from&&v.to&&v.status!=='confirmed'){
      if(nightList(v.from,v.to).find(d=>bookedAll(v.pid).has(d)||blockedSet(v.pid).has(d)))throw new Error('DATES_UNAVAILABLE');}
    if(v.status==='confirmed'&&status!=='confirmed')await ART.avail(v,false);
    if(status==='confirmed'&&v.status!=='confirmed')await ART.avail(v,true);
    await writeDoc('bookings',v.uid,n=>{const b=n.items[v.id];if(b){b.status=status;if(reply)b.reply=reply;if(['cancelled','rejected','completed'].includes(status))b.cancelReq=false;b.decidedAt=new Date().toISOString()}});
    return {status};
  }
};
const bkOtpRequest=ph=>BOOKAPI.hosted?JW_BOOK.otpRequest(ph):ART.otpRequest(ph);
const bkOtpVerify=(ph,c)=>BOOKAPI.hosted?JW_BOOK.otpVerify(ph,c):ART.otpVerify(ph,c);
const bkCreate=(pid,pl)=>BOOKAPI.hosted?JW_BOOK.create(pid,Object.assign({src:srcTag()},pl)):ART.create(pid,pl);
const bkCancel=v=>BOOKAPI.hosted?JW_BOOK.cancel(v.id):ART.cancel(v);
const bkSetStatus=(v,s,r)=>BOOKAPI.hosted?JW_BOOK.setStatus(v.id,s,r):ART.setStatus(v,s,r);
async function bkAfter(){if(BOOKAPI.hosted)await bkLoad();else sync()}

/* ---- WhatsApp ---- */
const WA_DEFAULT='أهلاً، أعجبني {name} وأود الاستفسار عن...';
function waNumber(p){const c=bkcfgAny(p.id);return normPhone(c&&c.wa)||normPhone(p.wa)}
function waLink(p){
  const n=waNumber(p);if(!n||isDemo(p))return '';
  const tpl=String((SET&&SET.waTemplate)||WA_DEFAULT).slice(0,500);
  return `https://wa.me/${n}?text=${encodeURIComponent(tpl.split('{name}').join(p.name))}`;
}
function bk2Cta(p){
  const h=$('#bkcta');if(!h)return;let s='';
  if(bk2Eligible(p))s+=`<button class="btn btn-brand" data-act="b2-go">${ic('check',18)} احجز الآن</button>`;
  const w=waLink(p);if(w)s+=`<a class="btn btn-wa" target="_blank" rel="noopener" href="${esc(w)}" data-act="b2-wa" data-id="${p.id}">${ic('chat',18)} تواصل عبر الواتساب</a>`;
  h.innerHTML=s;
}

/* ---- place page: booking card ---- */
function bk2Reset(p){const cfg=bkcfg(p.id),n=nowYM();Object.assign(BK,{pid:p.id,y:n.y,m:n.m,a:'',b:'',err:'',busy:false,step:'form',otp:null,otpBusy:false,verified:'',res:null});BK.F={name:(BKPROF&&BKPROF.name)||'',phone:(BKPROF&&BKPROF.phone)||'',qty:cfg?String(Math.max(1,+cfg.min||1)):'1',slot:'',service:'',note:'',x:{}}}
let BKPROF=null;
function bk2Capture(id,v){
  const F=BK.F;if(!F)return;
  if(id==='b2-name')F.name=v;else if(id==='b2-phone'){F.phone=v;if(normPhone(v)!==BK.verified){BK.verified='';BK.otp=null}}
  else if(id==='b2-qty')F.qty=v;else if(id==='b2-slot')F.slot=v;else if(id==='b2-service')F.service=v;else if(id==='b2-note')F.note=v;
  else if(id.startsWith('b2-x-'))F.x[id.slice(5)]=v;
}
function bk2Validate(cfg){
  const T=btypeOf(cfg),F=BK.F;
  if((F.name||'').trim().length<2)return 'اكتب الاسم الكامل.';
  if(!normPhone(F.phone))return 'رقم الجوال غير صالح (مثال: 05XXXXXXXX).';
  if(T.date==='range'){if(!BK.a||!BK.b)return 'اختر تاريخ الوصول وتاريخ المغادرة.';if(nightsBetween(BK.a,BK.b)>60)return 'الحد الأقصى 60 ليلة.'}
  else if(T.date==='one'&&!BK.a)return 'اختر التاريخ.';
  if(T.qty){const mn=Math.max(1,+cfg.min||1),mx=+cfg.max||T.qmax,q=Math.floor(+F.qty);if(!(q>=mn&&q<=mx))return `${T.qty}: من ${mn} إلى ${mx}.`}
  if((cfg.slots||[]).length){if(!cfg.slots.includes(F.slot))return 'اختر الفترة المتاحة.'}else if(T.time&&!/^([01]?\d|2[0-3]):[0-5]\d$/.test(F.slot||''))return 'اختر الوقت.';
  if((cfg.services||[]).length&&!cfg.services.find(s=>s.n===F.service))return 'اختر الخدمة.';
  for(const f of (cfg.extra||[]))if(f.req&&!(F.x[f.k]||'').trim())return `الحقل مطلوب: ${f.l}`;
  if(T.date==='range'&&nightList(BK.a,BK.b).find(d=>bookedAll(BK.pid).has(d)||blockedSet(BK.pid).has(d)))return 'الفترة تتضمن يومًا غير متاح.';
  return '';
}
function bk2Payload(cfg){
  const F=BK.F,T=btypeOf(cfg),x={};(cfg.extra||[]).forEach(f=>{const v=(F.x[f.k]||'').trim();if(v)x[f.k]=v});
  return {name:F.name.trim(),phone:F.phone.trim(),from:BK.a||'',to:T.date==='range'?BK.b:(BK.a||''),qty:T.qty?Math.floor(+F.qty):1,slot:F.slot||'',service:F.service||'',note:(F.note||'').trim().slice(0,500),extra:x};
}
function bk2PriceBox(cfg){
  const c=bkCalc(cfg,BK.F,BK.a,BK.b);
  return `<div class="pbox" id="b2price"><b>تفاصيل السعر</b>${bkLines(c).map(l=>`<div>${esc(l)}</div>`).join('')}<div class="ptot"><span>الإجمالي</span><b class="num">${esc(bkTotalTxt(c))}</b></div><small>${BOOKAPI.hosted?'يُعاد حساب السعر في الخادم عند التأكيد.':'نسخة المعاينة: يُحسب السعر في المتصفح ويراجعه المالك.'}</small></div>`;
}
const STEPS=[['form','البيانات'],['verify','التحقق من الجوال'],['review','المراجعة']];
function bk2Steps(){const i=STEPS.findIndex(s=>s[0]===BK.step);return `<ol class="b2steps" aria-label="خطوات الحجز">${STEPS.map((s,k)=>`<li class="${k<i?'done':k===i?'cur':''}"${k===i?' aria-current="step"':''}>${s[1]}</li>`).join('')}</ol>`}
function fillBooking(p){
  const h=$('#bk');if(!h)return;
  const cfg=bkcfg(p.id);
  if(!cfg||isDemo(p)){h.remove();return}
  if(BK.pid!==p.id){bk2Reset(p);bkLoadBooked(p.id)}
  const T=btypeOf(cfg),head=`<h2 id="bk-anchor" style="font-size:19px">${esc(T.t)}</h2>`,say=t=>{h.innerHTML=head+`<p class="cap" style="margin-top:8px">${t}</p>`};
  if(!window.claude)return say(esc(NOBACK));
  if(ACC.uid===undefined)return say('جارٍ التحميل…');
  if(!ACC.uid){
    const auth=!!window.JW_AUTH;
    h.innerHTML=head+`<p class="cap" style="margin-top:8px">لإتمام الحجز سجّل الدخول أو أنشئ حسابًا جديدًا. بياناتك لا يراها غيرك وغير الإدارة.</p>${auth?`<div class="admbtns"><button class="btn btn-brand" data-act="login-next" data-mode="login">تسجيل الدخول</button><button class="btn btn-line" data-act="login-next" data-mode="signup">إنشاء حساب</button></div>`:`<p class="cap">${esc(LOGIN_HINT())}</p>`}`;
    return;
  }
  const F=BK.F;
  if(BK.step==='done'&&BK.res){
    const r=BK.res,msg=r.status==='confirmed'?'تم تأكيد حجزك فورًا.':r.status==='new'?'استلمنا استفسارك وستتواصل معك الإدارة بالسعر والتفاصيل.':'استلمنا طلبك وهو بانتظار موافقة الإدارة. لا يُعد حجزًا مؤكدًا قبل ذلك.';
    h.innerHTML=head+`<div class="admnote ok" style="margin-top:10px"><b>رقم الحجز: <bdi class="num">${esc(r.code)}</bdi></b><br>${bstChip(r.status)} ${esc(msg)}${r.total!=null&&r.total>0?`<br>الإجمالي: <b class="num">${fmt(r.total)}</b> ر.س`:''}</div><div class="admbtns"><a class="btn btn-brand btn-sm" href="#bookings">حجوزاتي</a><button class="btn btn-line btn-sm" data-act="b2-new">حجز آخر</button></div><p class="cap">لا يوجد دفع إلكتروني حاليًا. تتم التسوية مباشرة مع المنشأة وفق سياستها.</p>`;
    return;
  }
  const calOn=T.date?`<div class="cal">${calHTML({y:BK.y,m:BK.m,a:BK.a,b:BK.b,booked:bookedAll(p.id),blocked:blockedSet(p.id),pick:T.date})}</div><p class="cap" style="margin:6px 0 0" id="b2dsum">${T.date==='range'?(BK.a?`الوصول: ${fmtD(BK.a)}${BK.b?` · المغادرة: ${fmtD(BK.b)} (${nightsBetween(BK.a,BK.b)} ليلة)`:' — اختر تاريخ المغادرة'}`:'اختر تاريخ الوصول ثم المغادرة'):(BK.a?`التاريخ: ${fmtD(BK.a)}`:'اختر التاريخ')}</p>`:'';
  const err=BK.err?`<div class="admnote warn" role="alert">${esc(BK.err)}</div>`:'';
  if(BK.step==='form'){
    const mn=Math.max(1,+cfg.min||1),mx=+cfg.max||T.qmax;
    const slotSel=(cfg.slots||[]).length?`<div class="fl"><label class="admlbl" for="b2-slot">${T.time?'الوقت':'الفترة'}</label><select id="b2-slot" class="admin-in"><option value="">— اختر —</option>${cfg.slots.map(s=>`<option${F.slot===s?' selected':''}>${esc(s)}</option>`).join('')}</select></div>`:(T.time?`<div class="fl"><label class="admlbl" for="b2-slot">الوقت</label><input id="b2-slot" class="admin-in" type="time" value="${esc(F.slot)}" dir="ltr"></div>`:'');
    const svcSel=(cfg.services||[]).length?`<div class="fl"><label class="admlbl" for="b2-service">${T.svc?'نوع الخدمة / التخصص':'الخدمة'}</label><select id="b2-service" class="admin-in"><option value="">— اختر —</option>${cfg.services.map(s=>`<option value="${esc(s.n)}"${F.service===s.n?' selected':''}>${esc(s.n)}${cfg.pricing&&cfg.pricing.unit!=='inquiry'&&cfg.pricing.unit!=='free'&&s.p!==undefined&&s.p!==''&&s.p!==null?' — '+fmt(s.p)+' ر.س':''}</option>`).join('')}</select></div>`:'';
    const qty=T.qty?`<div class="fl"><label class="admlbl" for="b2-qty">${esc(T.qty)}</label><input id="b2-qty" class="admin-in" type="number" inputmode="numeric" min="${mn}" max="${mx}" value="${esc(F.qty)}" dir="ltr"></div>`:'';
    const extras=(cfg.extra||[]).map(f=>`<div class="fl full"><label class="admlbl" for="b2-x-${esc(f.k)}">${esc(f.l)}${f.req?' *':''}</label><input id="b2-x-${esc(f.k)}" class="admin-in" value="${esc(F.x[f.k]||'')}"></div>`).join('');
    h.innerHTML=head+bk2Steps()+calOn+`<div class="bkform2"><div class="fl"><label class="admlbl" for="b2-name">الاسم الكامل</label><input id="b2-name" class="admin-in" autocomplete="name" value="${esc(F.name)}"></div><div class="fl"><label class="admlbl" for="b2-phone">رقم الجوال</label><input id="b2-phone" class="admin-in" type="tel" dir="ltr" autocomplete="tel" placeholder="05XXXXXXXX" value="${esc(F.phone)}"></div>${BKEMAIL()?`<div class="fl full"><label class="admlbl">البريد الإلكتروني (من حسابك)</label><input class="admin-in" dir="ltr" value="${esc(BKEMAIL())}" readonly></div>`:''}${qty}${slotSel}${svcSel}${extras}<div class="fl full"><label class="admlbl" for="b2-note">ملاحظات (اختياري)</label><textarea id="b2-note" class="admin-in" rows="2">${esc(F.note)}</textarea></div></div>${bk2PriceBox(cfg)}${err}<div class="admbtns"><button class="btn btn-brand" data-act="b2-next">متابعة للتحقق من الجوال</button></div><p class="cap">الحجز باسم حسابك فقط. ${cfg.type==='stay'&&cfg.instant?'التأكيد فوري عند توفر التواريخ.':'يتطلب الطلب موافقة الإدارة.'} لا يوجد دفع إلكتروني حاليًا.</p>`;
    return;
  }
  if(BK.step==='verify'){
    const o=BK.otp;
    h.innerHTML=head+bk2Steps()+`<div class="admnote" style="margin-top:10px"><b>تحقق تجريبي محلي</b><br>هذه الخطوة تحاكي رسالة التحقق ولا تُثبت ملكية الرقم فعليًا، ولا يُوصف الرقم بأنه موثّق. يُستبدل بمزود رسائل نصية حقيقي لاحقًا.</div><p class="cap" style="margin-top:12px">رقم الجوال: <bdi class="num">${esc(F.phone)}</bdi> <button class="btn btn-line btn-sm" data-act="b2-back" style="margin-inline-start:8px">تعديل</button></p>
     ${o?`<div class="admnote ok" id="b2demo">رمز التجربة لهذا الطلب: <b class="num otpv">${esc(o.code)}</b> — صالح 5 دقائق ويتغير مع كل طلب.</div><div class="fl"><label class="admlbl" for="b2-otp">أدخل الرمز</label><input id="b2-otp" class="admin-in" inputmode="numeric" maxlength="6" dir="ltr" autocomplete="one-time-code" placeholder="000000"></div>${err}<div class="admbtns"><button class="btn btn-brand" data-act="b2-otp-check" ${BK.busy?'disabled':''}>تحقق</button><button class="btn btn-line" data-act="b2-otp-send" ${BK.otpBusy?'disabled':''}>إرسال رمز جديد</button></div>`:`${err}<div class="admbtns"><button class="btn btn-brand" data-act="b2-otp-send" ${BK.otpBusy?'disabled':''}>إرسال رمز التحقق</button><button class="btn btn-line" data-act="b2-back">رجوع</button></div>`}`;
    return;
  }
  /* review */
  const c=bkCalc(cfg,F,BK.a,BK.b),sv=F.service,rows=[['المنشأة',p.name],['نوع الحجز',T.l]];
  if(T.date==='range')rows.push(['الوصول',fmtD(BK.a)],['المغادرة',fmtD(BK.b)],['عدد الليالي',String(c.nights)]);else if(T.date==='one')rows.push(['التاريخ',fmtD(BK.a)]);
  if(F.slot)rows.push([(cfg.slots||[]).length&&!T.time?'الفترة':'الوقت',F.slot]);
  if(T.qty)rows.push([T.qty,String(c.qty)]);
  if(sv)rows.push(['الخدمة',sv]);
  (cfg.extra||[]).forEach(f=>{if((F.x[f.k]||'').trim())rows.push([f.l,F.x[f.k].trim()])});
  rows.push(['الاسم',F.name.trim()],['الجوال',F.phone.trim()+' — تحقق تجريبي (غير موثّق فعليًا)']);if(BKEMAIL())rows.push(['البريد',BKEMAIL()]);
  if((F.note||'').trim())rows.push(['ملاحظات',F.note.trim()]);
  h.innerHTML=head+bk2Steps()+`<dl class="b2sum">${rows.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${bk2PriceBox(cfg)}${cfg.cancel?`<p class="cap"><b>سياسة الإلغاء:</b> ${esc(cfg.cancel)}</p>`:''}${err}<div class="admbtns"><button class="btn btn-brand" data-act="b2-confirm" ${BK.busy?'disabled':''}>${BK.busy?'جارٍ الإرسال…':'تأكيد طلب الحجز'}</button><button class="btn btn-line" data-act="b2-back" ${BK.busy?'disabled':''}>تعديل البيانات</button></div><p class="cap">${cfg.type==='stay'&&cfg.instant?'سيُؤكَّد الحجز فورًا إن كانت التواريخ متاحة.':'سيُسجَّل الطلب بانتظار موافقة الإدارة.'}</p>`;
}
const BKEMAIL=()=>(window.JW_AUTH&&JW_AUTH.signedIn())?JW_AUTH.email():'';
function bkDay(day){
  const p=PLID[BK.pid],cfg=p&&bkcfg(p.id);if(!cfg)return;const T=btypeOf(cfg);BK.err='';
  if(T.date==='one'){BK.a=day}
  else if(!BK.a||BK.b||day<=BK.a){BK.a=day;BK.b=''}
  else{const bad=nightList(BK.a,day).find(d=>bookedAll(p.id).has(d)||blockedSet(p.id).has(d));if(bad)BK.err='الفترة تتضمن يومًا غير متاح.';else BK.b=day}
  fillBooking(p);
}
function bk2ReadDom(){document.querySelectorAll('#bk [id^=b2-]').forEach(el=>{if(el.id!=='b2-otp')bk2Capture(el.id,el.value)})}
async function bk2Do(act){
  const p=PLID[BK.pid],cfg=p&&bkcfg(p.id);if(!cfg)return;
  bk2ReadDom();
  if(act==='next'){
    BK.err=bk2Validate(cfg);if(BK.err){fillBooking(p);return}
    BK.step=BK.verified===normPhone(BK.F.phone)?'review':'verify';fillBooking(p);
  }else if(act==='back'){BK.step=BK.step==='review'?'form':'form';BK.err='';fillBooking(p)}
  else if(act==='otp-send'){
    BK.otpBusy=true;BK.err='';fillBooking(p);
    try{const r=await bkOtpRequest(BK.F.phone);BK.otp={mode:r.mode||'demo',code:r.code||''}}catch(e){BK.err=bkErr(e)}
    BK.otpBusy=false;fillBooking(p);
  }else if(act==='otp-check'){
    const code=(($('#b2-otp')||{}).value||'').trim();BK.err='';
    if(!/^\d{6}$/.test(code)){BK.err='اكتب الرمز المكوّن من 6 أرقام.';fillBooking(p);return}
    BK.busy=true;let ok=false;try{ok=await bkOtpVerify(BK.F.phone,code)}catch(e){BK.err=bkErr(e)}
    BK.busy=false;
    if(ok){BK.verified=normPhone(BK.F.phone);BK.step='review';BK.err=''}else if(!BK.err)BK.err='الرمز غير صحيح أو انتهت صلاحيته.';
    fillBooking(p);
  }else if(act==='confirm'){
    BK.err=bk2Validate(cfg);if(BK.err){BK.step='form';fillBooking(p);return}
    BK.busy=true;fillBooking(p);
    try{const r=await bkCreate(p.id,bk2Payload(cfg));BK.res=r;BK.step='done';await bkAfter();bkLoadBooked(p.id)}
    catch(e){BK.err=bkErr(e);if(/PHONE_NOT_VERIFIED/.test(String(e&&e.message))){BK.verified='';BK.otp=null;BK.step='verify'}else if(/DATES_UNAVAILABLE/.test(String(e&&e.message)))BK.step='form'}
    BK.busy=false;fillBooking(p);
  }
}

/* ---- customer: my bookings ---- */
function viewBookings(){
  MOUNT.push(fillBookings);
  return `<section class="phead"><div class="wrap"><div class="crumbs"><a href="#home">الرئيسية</a> / <span>حجوزاتي</span></div><div class="eyebrow lat" style="letter-spacing:.2em">My bookings</div><h1>حجوزاتي</h1><p>تابع حالة طلباتك. لا يرى هذه الصفحة غيرك.</p></div></section><section class="sec"><div class="wrap" id="b2my"></div></section>`;
}
function loginCard(title,txt,mode){
  return `<div class="card guard"><h2>${esc(title)}</h2><p>${esc(txt)}</p>${window.JW_AUTH?`<div class="admbtns"><button class="btn btn-brand" data-act="login-next" data-mode="${mode||'login'}">تسجيل الدخول</button>${mode==='owner'?'':'<button class="btn btn-line" data-act="login-next" data-mode="signup">إنشاء حساب</button>'}</div>`:`<p class="cap">${esc(LOGIN_HINT())}</p>`}</div>`;
}
const isPast=v=>['rejected','cancelled','completed'].includes(v.status)||((v.to||v.from)&&(v.to||v.from)<todayISO()&&v.status!=='pending'&&v.status!=='new');
function bkDetailLines(v){
  const T=BTYPES[v.btype]||BTYPES.service,o=[];
  if(v.from)o.push(v.to&&v.to!==v.from?`${fmtD(v.from)} ← ${fmtD(v.to)}${v.nights?` (${v.nights} ليلة)`:''}`:fmtD(v.from));
  if(v.slot)o.push((v.btype==='table'||v.btype==='appointment')?'الوقت: '+v.slot:'الفترة: '+v.slot);
  if(T.qty&&v.qty)o.push(`${T.qty}: ${v.qty}`);
  if(v.service)o.push('الخدمة: '+v.service);
  return o;
}
const priceTxt=v=>v.unit==='inquiry'||v.total==null?'بالاستفسار':v.total===0?'مجاني':fmt(v.total)+' ر.س';
function myBkCard(v){
  const p=PLID[v.pid],cfg=bkcfgAny(v.pid)||{},can=v.status==='new'||v.status==='pending'||(v.status==='confirmed'&&!v.cancelReq);
  return `<div class="admrow b2row"><div><b><bdi class="num">${esc(v.code)}</bdi></b> ${bstChip(v.status)} ${v.cancelReq?'<span class="stchip st-pending">طلب إلغاء مُرسل</span>':''}
   <small>${p?`<a href="#place-${p.slug}" style="text-decoration:underline">${esc(v.pname||p.name)}</a>`:esc(v.pname)} · ${esc((BTYPES[v.btype]||BTYPES.service).l.split(' — ')[0])}</small>
   ${bkDetailLines(v).map(l=>`<small>${esc(l)}</small>`).join('')}
   <small>السعر الإجمالي: <b class="num">${esc(priceTxt(v))}</b></small>
   ${v.reply?`<small>رد الإدارة: ${esc(v.reply)}</small>`:''}
   ${v.status==='pending'||v.status==='new'?'<small>طلبك بانتظار مراجعة الإدارة.</small>':''}
   ${cfg.cancel&&(v.status==='confirmed'||v.status==='pending'||v.status==='new')?`<small>سياسة الإلغاء: ${esc(cfg.cancel)}</small>`:''}
   <small>أُنشئ: ${esc(fmtDT(v.createdAt))}</small></div>
   <div class="admact">${can?`<button class="btn btn-line btn-sm danger" data-act="b2-cancel" data-id="${esc(v.id)}">${v.status==='confirmed'?'طلب إلغاء':'إلغاء الطلب'}</button>`:''}</div></div>`;
}
const fmtDT=iso=>{try{return new Date(iso).toLocaleString('ar-SA-u-nu-latn',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}};
function fillBookings(){
  const h=$('#b2my');if(!h)return;
  if(!window.claude)return h.innerHTML=`<div class="admnote warn">${esc(NOBACK)}</div>`;
  if(ACC.uid===undefined)return h.innerHTML='<div class="admnote">جارٍ التحميل…</div>';
  if(!ACC.uid)return h.innerHTML=loginCard('سجّل الدخول لعرض حجوزاتك','حجوزاتك مرتبطة بحسابك ولا يراها غيرك.','login');
  const mine=BKV.filter(v=>v.uid===ACC.uid),cur=mine.filter(v=>!isPast(v)),old=mine.filter(isPast);
  h.innerHTML=`<div class="admgrid"><div class="card"><h2 style="font-size:20px">حجوزاتي الحالية <span class="num" style="color:var(--muted);font-size:15px">(${cur.length})</span></h2>${cur.length?cur.map(myBkCard).join(''):'<p style="color:var(--muted)">لا توجد حجوزات حالية. افتح صفحة منشأة تتيح الحجز واضغط «احجز الآن».</p>'}</div>
  <div class="card"><h2 style="font-size:20px">الحجوزات السابقة <span class="num" style="color:var(--muted);font-size:15px">(${old.length})</span></h2>${old.length?old.map(myBkCard).join(''):'<p style="color:var(--muted)">لا توجد حجوزات سابقة.</p>'}</div></div><p class="cap">لا يوجد دفع إلكتروني في هذه النسخة. الإلغاء قبل المراجعة فوري، وبعد التأكيد يُرسل طلب للإدارة وفق سياسة المنشأة.</p>`;
}

/* ---- owner: booking management section ---- */
function bkFiltered(){
  const q=norm(BF.q);
  return BKV.filter(b=>{const d=b.from||(b.createdAt||'').slice(0,10);
    return (!BF.status||b.status===BF.status)&&(!BF.pid||b.pid===BF.pid)&&(!BF.from||d>=BF.from)&&(!BF.to||d<=BF.to)&&(!q||norm([b.code,b.name,b.phone,b.email,b.pname].join(' ')).includes(q))}).sort((x,y)=>(y.createdAt||'').localeCompare(x.createdAt||''));
}
function priceMismatch(v){
  if(BOOKAPI.hosted||v.v!==2)return false;const cfg=bkcfgAny(v.pid);if(!cfg)return false;
  const c=bkCalc(cfg,{qty:v.qty,service:v.service},v.from,v.to);return (c.total==null?null:c.total)!==(v.total==null?null:v.total);
}
function bkAdminCard(v){
  const open=BKX.has(v.id),T=BTYPES[v.btype]||BTYPES.service,pvTxt=v.pv==='demo'?'تحقق تجريبي محلي (غير موثّق فعليًا)':v.pv==='sms'?'تحقق حقيقي عبر رسالة نصية':'بدون تحقق (طلب قديم)';
  const live=v.status==='new'||v.status==='pending';
  return `<div class="admrow b2row"><div><b><bdi class="num">${esc(v.code)}</bdi></b> ${bstChip(v.status)} ${v.cancelReq?'<span class="stchip st-pending">طلب إلغاء</span>':''}${priceMismatch(v)?' <span class="stchip st-rejected">السعر لا يطابق الإعدادات</span>':''}
   <small>${esc(v.pname)} · ${esc(T.l.split(' — ')[0])}</small>
   <small>العميل: ${esc(v.name)} · <bdi class="num">${esc(v.phone)}</bdi>${v.email?' · '+esc(v.email):''}</small>
   ${bkDetailLines(v).map(l=>`<small>${esc(l)}</small>`).join('')}
   <small>الإجمالي: <b class="num">${esc(priceTxt(v))}</b> · أُنشئ: ${esc(fmtDT(v.createdAt))}</small>
   <small>الجوال: ${esc(pvTxt)}</small>
   ${open?`${Object.entries(v.extra||{}).map(([k,val])=>{const f=((bkcfgAny(v.pid)||{}).extra||[]).find(x=>x.k===k);return `<small>${esc(f?f.l:k)}: ${esc(val)}</small>`}).join('')}${v.note?`<small>ملاحظة العميل: ${esc(v.note)}</small>`:''}${v.reply?`<small>رد الإدارة: ${esc(v.reply)}</small>`:''}${v.unit&&v.price!=null?`<small>سعر الوحدة: <span class="num">${fmt(v.price)}</span> ر.س</small>`:''}${v.src?`<small>المصدر: ${esc(v.src)}</small>`:''}<small>معرّف: <bdi class="num">${esc(v.id)}</bdi></small>`:''}
   <button class="btn btn-line btn-sm" data-act="b2-detail" data-id="${esc(v.id)}" style="margin-top:8px">${open?'إخفاء التفاصيل':'عرض التفاصيل'}</button></div>
   <div class="admact b2act"><input id="b2n-${esc(v.id)}" class="admin-in" placeholder="رد / سبب (إلزامي عند الرفض)" aria-label="رد للعميل">
    ${live?`<button class="btn btn-brand btn-sm" data-act="b2-st" data-s="confirmed" data-id="${esc(v.id)}">قبول</button><button class="btn btn-line btn-sm danger" data-act="b2-st" data-s="rejected" data-id="${esc(v.id)}">رفض</button>`:''}
    ${v.status==='confirmed'?`<button class="btn btn-brand btn-sm" data-act="b2-st" data-s="completed" data-id="${esc(v.id)}">إكمال</button>`:''}
    ${(v.status==='confirmed'||live)?`<button class="btn btn-line btn-sm danger" data-act="b2-st" data-s="cancelled" data-id="${esc(v.id)}">إلغاء</button>`:''}
    <select id="b2s-${esc(v.id)}" class="admin-in" aria-label="تعديل الحالة">${Object.keys(BST).map(s=>`<option value="${s}"${s===v.status?' selected':''}>${BST[s]}</option>`).join('')}</select><button class="btn btn-line btn-sm" data-act="b2-st" data-s="select" data-id="${esc(v.id)}">تحديث الحالة</button></div></div>`;
}
function bkStats(){
  const by=s=>BKV.filter(b=>b.status===s).length,conf=BKV.filter(b=>b.status==='confirmed'||b.status==='completed'),gmv=conf.reduce((s,b)=>s+(b.total||0),0);
  return `<div class="kpis">${kpi(BKV.length,'كل الطلبات')}${kpi(by('new'),'جديدة')}${kpi(by('pending'),'بانتظار الموافقة')}${kpi(by('confirmed'),'مؤكدة')}${kpi(by('completed'),'مكتملة')}${kpi(by('rejected')+by('cancelled'),'مرفوضة / ملغاة')}${kpi(BKV.filter(b=>b.cancelReq).length,'طلبات إلغاء')}</div><p class="cap">قيمة الحجوزات المؤكدة والمكتملة: <b class="num">${fmt(gmv)}</b> ر.س — إجمالي قيمة الحجوزات وليس إيرادًا للمنصة.</p>`;
}
function bkListHTML(){
  const rows=bkFiltered();
  return rows.length?rows.slice(0,60).map(bkAdminCard).join('')+(rows.length>60?`<p class="cap">يُعرض أحدث 60 من ${rows.length}. ضيّق البحث لعرض الباقي.</p>`:''):`<p style="color:var(--muted)">${BKV.length?'لا توجد نتائج مطابقة.':'لا توجد طلبات حجز بعد.'}</p>`;
}
function adminBookings(){
  const lives=Array.from(new Set(BKV.map(b=>b.pid))).map(id=>[id,(BKV.find(b=>b.pid===id)||{}).pname||id]);
  const chip=(s,t)=>`<button class="fchip" data-act="b2-quick" data-s="${s}" aria-pressed="${BF.status===s}">${t}</button>`;
  return `<div class="card" style="margin-bottom:20px" id="b2admin"><h2 style="font-size:20px">طلبات الحجز والزيارة <span class="num" style="color:var(--muted);font-size:15px">(${BKV.length})</span></h2>${bkStats()}
  <div class="chips" style="margin:14px 0 8px">${chip('','الكل')}${chip('new','الجديدة')}${chip('pending','المعلّقة')}${chip('confirmed','المؤكدة')}${chip('completed','المكتملة')}${chip('rejected','المرفوضة')}${chip('cancelled','الملغاة')}</div>
  <form class="b2filter" data-form="b2f"><div class="fl"><label class="admlbl" for="b2f-q">بحث (رقم الحجز أو اسم العميل)</label><input id="b2f-q" class="admin-in" value="${esc(BF.q)}" placeholder="JW-… أو الاسم"></div><div class="fl"><label class="admlbl" for="b2f-pid">المنشأة</label><select id="b2f-pid" class="admin-in"><option value="">كل المنشآت</option>${lives.map(([id,n])=>`<option value="${esc(id)}"${BF.pid===id?' selected':''}>${esc(n)}</option>`).join('')}</select></div><div class="fl"><label class="admlbl" for="b2f-status">الحالة</label><select id="b2f-status" class="admin-in"><option value="">كل الحالات</option>${Object.keys(BST).map(s=>`<option value="${s}"${BF.status===s?' selected':''}>${BST[s]}</option>`).join('')}</select></div><div class="fl"><label class="admlbl" for="b2f-from">تاريخ الزيارة من</label><input id="b2f-from" class="admin-in" type="date" value="${esc(BF.from)}" dir="ltr"></div><div class="fl"><label class="admlbl" for="b2f-to">إلى</label><input id="b2f-to" class="admin-in" type="date" value="${esc(BF.to)}" dir="ltr"></div><div class="fl b2fbtn"><button class="btn btn-line btn-sm" type="submit">تطبيق</button> <button class="btn btn-line btn-sm" type="button" data-act="b2-fclear">مسح</button></div></form>
  <div id="b2list">${bkListHTML()}</div></div>`;
}
function fillBkList(){const l=$('#b2list');if(l)l.innerHTML=bkListHTML()}
async function bkStatusAct(id,s,a){
  const v=BKV.find(x=>x.id===id);if(!v||!CAN)return;
  const reply=(($('#b2n-'+id)||{}).value||'').trim();
  if(s==='select'){s=($('#b2s-'+id)||{}).value||v.status}
  if(s===v.status&&!reply){toast('لا تغيير');return}
  if(s==='rejected'&&!reply){toast('اكتب سبب الرفض للعميل');return}
  if((s==='cancelled')&&!sure(a,'إلغاء'))return;
  try{await bkSetStatus(v,s,reply);toast('تم تحديث الحالة');await bkAfter();fillAccount()}
  catch(e){toast(bkErr(e))}
}

/* ---- owner: booking settings per place ---- */
const slugK=i=>'f'+(i+1);
function bsDefault(p){const bt=MODE_BT[CAT[p.cat].mode]||'service',T=BTYPES[bt];return {enabled:false,type:bt,instant:false,pricing:{unit:T.unit,price:p.price!=null?p.price:''},min:1,max:T.qmax,slots:[],services:[],extra:[],cancel:'يمكن إلغاء الطلب قبل مراجعته. بعد التأكيد يُرسل طلب إلغاء للإدارة ويخضع لسياسة المنشأة.',wa:''}}
function bsLoad(pid){const p=PLID[pid];BS.pid=pid;BS.err='';BS.d=p?JSON.parse(JSON.stringify(bkcfgAny(pid)||bsDefault(p))):null}
function bsRead(){
  if(!BS.d||!$('#bs-type'))return;const g=id=>(($('#'+id)||{}).value||'').trim(),d=BS.d;
  d.enabled=!!($('#bs-enabled')||{}).checked;d.type=g('bs-type')||d.type;d.instant=!!($('#bs-instant')||{}).checked;
  d.pricing={unit:g('bs-unit')||d.pricing.unit,price:g('bs-price')};d.min=g('bs-min');d.max=g('bs-max');
  d.slotsTxt=($('#bs-slots')||{}).value||'';d.servicesTxt=($('#bs-services')||{}).value||'';d.extraTxt=($('#bs-extra')||{}).value||'';
  d.cancel=g('bs-cancel');d.wa=g('bs-wa');
}
function bsTxt(d){
  return {slots:d.slotsTxt!==undefined?d.slotsTxt:(d.slots||[]).join('\n'),services:d.servicesTxt!==undefined?d.servicesTxt:(d.services||[]).map(s=>s.p!==undefined&&s.p!==''&&s.p!==null?`${s.n}=${s.p}`:s.n).join('\n'),extra:d.extraTxt!==undefined?d.extraTxt:(d.extra||[]).map(f=>f.l+(f.req?'*':'')).join('\n')};
}
function bsBuild(){
  bsRead();const d=BS.d,T=BTYPES[d.type];if(!T)return {err:'اختر نوع الحجز.'};
  const t=bsTxt(d),cfg={enabled:!!d.enabled,type:d.type,instant:d.type==='stay'&&!!d.instant,pricing:{unit:d.pricing.unit},cancel:String(d.cancel||'').slice(0,400),wa:String(d.wa||'').trim()};
  if(!T.units.includes(cfg.pricing.unit))return {err:'وحدة السعر لا تناسب هذا النوع.'};
  if(['ticket','night','flat'].includes(cfg.pricing.unit)){const pr=Number(d.pricing.price);if(d.pricing.price===''||!isFinite(pr)||pr<0)return {err:'اكتب السعر (رقم صحيح).'};cfg.pricing.price=pr}
  if(cfg.wa&&!normPhone(cfg.wa))return {err:'رقم واتساب غير صالح (مثال: 05XXXXXXXX أو 9665XXXXXXXX).'};
  if(cfg.wa)cfg.wa=normPhone(cfg.wa);
  const mn=Number(d.min||1),mx=Number(d.max||T.qmax);
  if(T.qty){if(!Number.isInteger(mn)||!Number.isInteger(mx)||mn<1||mx<mn||mx>500)return {err:'الحد الأدنى والأقصى للعدد غير صحيحين.'};cfg.min=mn;cfg.max=mx}
  cfg.slots=t.slots.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,12).map(x=>x.slice(0,40));
  cfg.services=t.services.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,12).map(x=>{const i=x.lastIndexOf('=');const n=(i>0?x.slice(0,i):x).trim().slice(0,80),p=i>0?x.slice(i+1).trim():'';return p===''?{n}:{n,p:Number(p)}});
  if(cfg.services.some(s=>!s.n||(s.p!==undefined&&!(s.p>=0))))return {err:'صيغة الخدمات غير صحيحة. اكتب كل خدمة في سطر: الاسم=السعر'};
  if(['ticket','night','flat'].includes(cfg.pricing.unit)&&cfg.services.length&&cfg.services.some(s=>s.p===undefined)&&!(cfg.pricing.price>=0))return {err:'حدد سعرًا لكل خدمة أو سعرًا عامًا.'};
  cfg.extra=t.extra.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6).map((x,i)=>({k:slugK(i),l:x.replace(/\*+$/,'').trim().slice(0,60),req:/\*$/.test(x)}));
  return {cfg};
}
function bkSettingsCard(){
  const lives=PLACES.filter(p=>p._live);
  const wat=(SET&&SET.waTemplate)||WA_DEFAULT;
  const waCard=`<div class="fl full" style="margin-top:14px"><label class="admlbl" for="bs-watpl">نص رسالة واتساب الافتراضي (استخدم {name} لاسم المنشأة)</label><textarea id="bs-watpl" class="admin-in" rows="2">${esc(wat)}</textarea><div class="admbtns"><button class="btn btn-line btn-sm" data-act="bs-wasave">حفظ نص الرسالة</button></div></div>`;
  if(!lives.length)return `<div class="card" style="margin-bottom:20px"><h2 style="font-size:20px">إعدادات الحجز لكل منشأة</h2><p style="color:var(--muted)">انشر منشأة أولًا (من «إضافة منشأة» أدناه ثم اعتمادها)، وبعدها تفعّل الحجز لها هنا. الحجز لا يعمل على السجلات التجريبية.</p>${waCard}</div>`;
  if(!BS.pid||!lives.find(p=>p.id===BS.pid)||!BS.d)bsLoad(lives[0].id);
  const d=BS.d,T=BTYPES[d.type]||BTYPES.service,t=bsTxt(d),u=d.pricing.unit;
  return `<div class="card" style="margin-bottom:20px" id="bsc"><h2 style="font-size:20px">إعدادات الحجز لكل منشأة</h2><p class="admhint" style="margin:4px 0 12px">يظهر زر «احجز الآن» فقط للمنشآت المفعّل لها الحجز. السعر النهائي يُحسب من هذه الإعدادات.</p>
  <div class="fgrid"><div class="fl full"><label class="admlbl" for="bs-pid">المنشأة</label><select id="bs-pid" class="admin-in">${lives.map(p=>`<option value="${p.id}"${p.id===BS.pid?' selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
  <div class="fl full"><label class="vfrow"><input type="checkbox" id="bs-enabled" ${d.enabled?'checked':''}> تفعيل الحجز لهذه المنشأة</label></div>
  <div class="fl"><label class="admlbl" for="bs-type">نوع الحجز</label><select id="bs-type" class="admin-in" data-bs="1">${Object.entries(BTYPES).map(([k,x])=>`<option value="${k}"${d.type===k?' selected':''}>${esc(x.l)}</option>`).join('')}</select></div>
  <div class="fl"><label class="admlbl" for="bs-unit">طريقة احتساب السعر</label><select id="bs-unit" class="admin-in" data-bs="1">${T.units.map(x=>`<option value="${x}"${u===x?' selected':''}>${BUNITS[x]}</option>`).join('')}</select></div>
  ${['ticket','night','flat'].includes(u)?`<div class="fl"><label class="admlbl" for="bs-price">السعر (ر.س)</label><input id="bs-price" class="admin-in" type="number" inputmode="decimal" min="0" step="any" dir="ltr" value="${esc(d.pricing.price)}"></div>`:''}
  ${T.qty?`<div class="fl"><label class="admlbl" for="bs-min">الحد الأدنى (${esc(T.qty)})</label><input id="bs-min" class="admin-in" type="number" min="1" dir="ltr" value="${esc(d.min)}"></div><div class="fl"><label class="admlbl" for="bs-max">الحد الأقصى</label><input id="bs-max" class="admin-in" type="number" min="1" dir="ltr" value="${esc(d.max)}"></div>`:''}
  ${d.type==='stay'?`<div class="fl full"><label class="vfrow"><input type="checkbox" id="bs-instant" ${d.instant?'checked':''}> حجز فوري (يُؤكَّد تلقائيًا إذا كانت التواريخ متاحة). وإلا يتطلب موافقتك.</label></div>`:'<div class="fl full"><small class="admhint">الحجز لهذا النوع يتطلب موافقة الإدارة دائمًا (لا توجد بيانات سعة فعلية للتأكيد الفوري).</small></div>'}
  <div class="fl full"><label class="admlbl" for="bs-slots">${T.time?'الأوقات المتاحة':'الفترات المتاحة'} (سطر لكل خيار، اختياري)</label><textarea id="bs-slots" class="admin-in" rows="3" placeholder="${T.time?'12:00&#10;14:00&#10;20:00':'صباحي&#10;مسائي'}">${esc(t.slots)}</textarea></div>
  <div class="fl full"><label class="admlbl" for="bs-services">الخدمات / التخصصات (سطر لكل خدمة: الاسم=السعر، اختياري)</label><textarea id="bs-services" class="admin-in" rows="3" placeholder="كشف عام=150&#10;أسنان=300">${esc(t.services)}</textarea></div>
  <div class="fl full"><label class="admlbl" for="bs-extra">حقول إضافية يطلبها العميل (سطر لكل حقل، ضع * في النهاية إن كان مطلوبًا)</label><textarea id="bs-extra" class="admin-in" rows="2" placeholder="رقم الهوية*&#10;الفئة العمرية">${esc(t.extra)}</textarea></div>
  <div class="fl full"><label class="admlbl" for="bs-cancel">سياسة الإلغاء</label><textarea id="bs-cancel" class="admin-in" rows="2">${esc(d.cancel||'')}</textarea></div>
  <div class="fl full"><label class="admlbl" for="bs-wa">رقم واتساب المنشأة (يظهر زر التواصل فقط عند إدخاله)</label><input id="bs-wa" class="admin-in" dir="ltr" placeholder="05XXXXXXXX" value="${esc(d.wa||'')}"></div></div>
  ${BS.err?`<div class="admnote warn" role="alert">${esc(BS.err)}</div>`:''}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="bs-save">حفظ إعدادات الحجز</button></div>${waCard}</div>`;
}
async function bsSave(){
  if(!CAN)return;const r=bsBuild();BS.err=r.err||'';if(r.err){fillAccount();return}
  try{await writeSetting('booking',it=>{it[BS.pid]=Object.assign({},r.cfg,{updatedAt:new Date().toISOString()})});BS.d=null;toast('تم حفظ إعدادات الحجز');fillAccount()}
  catch(e){BS.err='تعذّر الحفظ. تأكد من صلاحية الإدارة.';fillAccount()}
}
async function waTplSave(){
  if(!CAN||!DB)return;const v=(($('#bs-watpl')||{}).value||'').trim().slice(0,500)||WA_DEFAULT;
  try{await DB.doc('settings/site').set(Object.assign({},SET,{waTemplate:v,updatedAt:new Date().toISOString()}));toast('تم حفظ نص الرسالة')}catch(e){toast('تعذّر الحفظ')}
}

/* ---- account page: customer view ---- */
function customerAccount(){
  const mine=BKV.filter(v=>v.uid===ACC.uid),email=BKEMAIL();
  const prof=BOOKAPI.hosted?`<div class="card"><h2 style="font-size:20px">بياناتي</h2>${email?`<p class="cap">البريد: <bdi>${esc(email)}</bdi></p>`:''}${fld('cu-name','الاسم الكامل',(BKPROF&&BKPROF.name)||'')}${fld('cu-phone','رقم الجوال',(BKPROF&&BKPROF.phone)||'',{dir:'ltr',ph:'05XXXXXXXX'})}<div class="admbtns"><button class="btn btn-brand btn-sm" data-act="cu-save">حفظ</button></div><p class="cap">تُستخدم لتعبئة نموذج الحجز تلقائيًا، ويمكنك تعديلها عند كل حجز.</p></div>`:'';
  return `<div class="accbar"><span class="stchip st-published">حساب عميل</span><span class="num" style="color:var(--muted);font-size:14px">${mine.length} حجز</span><a class="btn btn-line btn-sm" href="#bookings">حجوزاتي</a></div>${prof}`;
}
async function cuSave(){
  const name=(($('#cu-name')||{}).value||'').trim(),phone=(($('#cu-phone')||{}).value||'').trim();
  if(name.length<2){toast('اكتب الاسم الكامل');return}
  if(phone&&!normPhone(phone)){toast('رقم الجوال غير صالح');return}
  try{await JW_BOOK.saveProfile({name,phone});BKPROF={name,phone};toast('تم حفظ بياناتك');fillAccount()}catch(e){toast('تعذّر الحفظ')}
}
function guardHTML(kind){
  /* kind: 'login' | 'forbidden' | 'loading' */
  if(kind==='loading')return `<div class="admnote">جارٍ التحقق من الصلاحيات…</div>`;
  if(kind==='forbidden')return `<div class="card guard"><h2>غير مصرّح لك بالدخول</h2><p>هذه اللوحة مقصورة على مالك المنصة. حسابك الحالي${BKEMAIL()?` (<bdi>${esc(BKEMAIL())}</bdi>)`:''} لا يملك هذه الصلاحية.</p><div class="admbtns">${window.JW_AUTH?'<button class="btn btn-line" data-act="logout">تسجيل الخروج</button>':''}<a class="btn btn-brand" href="#home">الرئيسية</a></div></div>`;
  return loginCard('تسجيل دخول المالك','هذه اللوحة مقصورة على مالك المنصة. سجّل الدخول بالبريد وكلمة المرور.','owner');
}
/* returns '' when the viewer is the owner/admin, otherwise the guard card HTML */
function ownerGuard(){
  if(!window.claude)return `<div class="admnote warn">${esc(NOBACK)}</div>`;
  if(ACC.uid===undefined||(DB===null&&CAN===null))return guardHTML('loading');
  if(!ACC.uid)return guardHTML('login');
  if(CAN!==true)return guardHTML('forbidden');
  return '';
}

function bk2UpdatePrice(){const p=PLID[BK.pid],cfg=p&&bkcfg(p.id),el=$('#b2price');if(!cfg||!el)return;bk2ReadDom();el.outerHTML=bk2PriceBox(cfg)}
function b2fApply(){const g=id=>(($('#'+id)||{}).value||'').trim();Object.assign(BF,{q:g('b2f-q'),pid:g('b2f-pid'),status:g('b2f-status'),from:g('b2f-from'),to:g('b2f-to')});fillAccount()}
function bk2Click(a,act){
  if(act==='bk-nav'){const d=+a.dataset.d;BK.m+=d;if(BK.m<0){BK.m=11;BK.y--}if(BK.m>11){BK.m=0;BK.y++}bk2ReadDom();fillBooking(PLID[BK.pid]);return true}
  if(act==='bk-day'){bk2ReadDom();bkDay(a.dataset.day);return true}
  if(act==='b2-go'){const t=$('#bk');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});return true}
  if(act==='b2-next'||act==='b2-back'||act==='b2-otp-send'||act==='b2-otp-check'||act==='b2-confirm'){bk2Do(act.slice(3));return true}
  if(act==='b2-new'){const p=PLID[BK.pid];if(p){bk2Reset(p);fillBooking(p)}return true}
  if(act==='b2-cancel'){const v=BKV.find(x=>x.id===a.dataset.id);if(!v)return true;if(!sure(a,a.textContent.trim()))return true;
    bkCancel(v).then(r=>{toast(r&&r.cancel_requested?'أُرسل طلب الإلغاء للإدارة':'أُلغي الطلب');return bkAfter()}).then(fillBookings).catch(e=>toast(bkErr(e)));return true}
  if(act==='b2-detail'){const id=a.dataset.id;if(BKX.has(id))BKX.delete(id);else BKX.add(id);fillBkList();return true}
  if(act==='b2-st'){bkStatusAct(a.dataset.id,a.dataset.s,a);return true}
  if(act==='b2-quick'){BF.status=a.dataset.s;fillAccount();return true}
  if(act==='b2-fclear'){Object.assign(BF,{q:'',status:'',pid:'',from:'',to:''});fillAccount();return true}
  if(act==='bs-save'){bsSave();return true}
  if(act==='bs-wasave'){waTplSave();return true}
  if(act==='cu-save'){cuSave();return true}
  if(act==='login-next'){if(window.JW_AUTH)JW_AUTH.open({mode:a.dataset.mode==='signup'?'signup':'login',next:location.pathname+location.search,owner:a.dataset.mode==='owner'});return true}
  return false;
}
/* typed/selected fields */
const BFK={'b2f-q':'q','b2f-pid':'pid','b2f-status':'status','b2f-from':'from','b2f-to':'to'};
function bk2OnInput(e){const id=e.target.id||'';if(BFK[id]){BF[BFK[id]]=e.target.value;return true}if(!id.startsWith('b2-'))return false;if(id==='b2-otp')return true;bk2Capture(id,e.target.value);if(id==='b2-qty')bk2UpdatePrice();return true}
function bk2OnChange(e){
  const t=e.target,id=t.id||'';
  if(id.startsWith('b2-')&&id!=='b2-otp'){bk2Capture(id,t.value);if(id==='b2-service'||id==='b2-qty')bk2UpdatePrice();return true}
  if(id==='bs-pid'){bsLoad(t.value);fillAccount();return true}
  if(t.dataset&&t.dataset.bs){bsRead();if(t.id==='bs-type'){const T=BTYPES[BS.d.type];if(T&&!T.units.includes(BS.d.pricing.unit))BS.d.pricing.unit=T.unit}fillAccount();return true}
  if(id==='b2f-pid'||id==='b2f-status'||id==='b2f-from'||id==='b2f-to'){b2fApply();return true}
  return false;
}

/* ==BOOK-END== */

/* ---------- events ---------- */
app.addEventListener('click',e=>{
  const t=e.target;
  if(PATHMODE){const an=t.closest&&t.closest('a[href]');if(an&&!an.target&&!an.hasAttribute('download')&&!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){const hr=an.getAttribute('href'),r=hrefToRaw(hr);if(r&&knownRoute(r)&&(hr[0]==='#'||hr[0]==='/')){e.preventDefault();const same=curRaw()===r;if(same){route()}else navTo(r);return}}}
  const tv=t.closest('[data-tv]');if(tv){const o=tv.closest('.tv');if(o&&o._act)o._act(tv.dataset.tv,tv);return}
  const mk=t.closest('[data-mk]');
  if(mk){const host=mk.closest('[id^=res-]');if(host){const key=host.id.slice(4),L=LST[key];if(L){L.st.sel=mk.dataset.mk;renderMap(host,runListing(L).filter(p=>true),key)}}else{const p=PLID[mk.dataset.mk];if(p)go('place-'+p.slug)}return}
  const f=t.closest('[data-l][data-f]');
  if(f&&(f.dataset.v!==undefined||f.classList.contains('fchip'))){
    const L=LST[f.dataset.l];if(!L)return;const fld=f.dataset.f;
    if(f.dataset.v!==undefined)L.st[fld]=f.dataset.v;else L.st[fld]=!L.st[fld];
    if(fld==='cat')L.st.price='';
    refresh(f.dataset.l);return;
  }
  const a=t.closest('[data-act]');if(!a)return;
  const act=a.dataset.act;
  if(bk2Click(a,act))return;
  if(act==='tour')openTour(a.dataset.id);
  else if(act==='adm-parse'){const raw=($('#kin')||{}).value||'';const r=TourProviders[ADM.prov].parse(raw);if(r.error){ADM.parsed=null;fillAdmin();const pv=$('#admprev');if(pv)pv.innerHTML=`<div class="admnote warn">${esc(r.error)}</div>`}else{ADM.parsed=r;fillAdmin()}}
  else if(act==='rv-star'){FM['rv-stars']=+a.dataset.n;fillReviews(PLID[a.closest('[data-pid]').dataset.pid])}
  else if(act==='rv-send')reviewSend(a.dataset.id,a);
  else if(act==='rv-del'){if(sure(a,'حذف تقييمي'))writeMine('reviews',n=>{delete n.items[a.dataset.id]}).then(()=>toast('تم حذف تقييمك'),()=>toast('تعذّر الحذف'))}
  else if(act==='oc-nav'){const d=+a.dataset.d;OC.m+=d;if(OC.m<0){OC.m=11;OC.y--}if(OC.m>11){OC.m=0;OC.y++}fillAccount()}
  else if(act==='oc-day'){const s=a.dataset.day;if(OC.sel.has(s))OC.sel.delete(s);else OC.sel.add(s);fillAccount()}
  else if(act==='oc-save'){const pid=OC.pid,list=Array.from(OC.sel).filter(d=>d>=todayISO()).sort();writeMine('availability',n=>{n.items[pid]={blocked:list}}).then(()=>{OC.sel=null;toast('تم حفظ التقويم')},e=>toast(canWriteMsg(e)))}
  else if(act==='of-save'){const g=id=>(FM[id]!==undefined?FM[id]:(($('#'+id)||{}).value||'')).trim(),pid=($('#of-pid')||{}).value||OC.pid,t=g('of-title'),d=g('of-desc'),f=g('of-from')||todayISO(),to=g('of-to');FM['of-err']='';
    if(t.length<3)FM['of-err']='اكتب عنوان العرض.';else if(!to||to<f)FM['of-err']='تاريخ الانتهاء يجب أن يكون بعد البداية.';
    if(FM['of-err'])fillAccount();else writeMine('offers',n=>{n.items[nid()]={pid,title:t.slice(0,80),desc:d.slice(0,400),from:f,to,at:new Date().toISOString()}}).then(()=>{['of-title','of-desc','of-from','of-to'].forEach(k=>delete FM[k]);toast('تم نشر العرض');fillAccount()},e=>{FM['of-err']=canWriteMsg(e);fillAccount()})}
  else if(act==='of-del'){if(sure(a,'حذف'))writeMine('offers',n=>{delete n.items[a.dataset.id]}).then(()=>toast('تم حذف العرض'),()=>toast('تعذّر الحذف'))}
  else if(act==='ofm-del'){if(sure(a,'إزالة'))writeDoc('offers',a.dataset.uid,n=>{delete n.items[a.dataset.id]}).then(()=>toast('أُزيل العرض'),()=>toast('تعذّر الإجراء'))}
  else if(act==='rvm'){writeDoc('reviews',a.dataset.uid,n=>{const r=n.items[a.dataset.id];if(r)r.hidden=!r.hidden}).catch(()=>toast('تعذّر الإجراء'))}
  else if(act==='cp-send'){const g=id=>(FM[id]!==undefined?FM[id]:(($('#'+id)||{}).value||'')).trim(),type=($('#cp-type')||{}).value||'other',pid=($('#cp-pid')||{}).value||'',text=g('cp-text');FM['cp-err']='';
    if(text.length<10)FM['cp-err']='اشرح المشكلة (10 أحرف على الأقل).';
    if(FM['cp-err'])fillAccount();else writeMine('complaints',n=>{const id=nid();n.items[id]={id,type,pid,text:text.slice(0,1000),status:'new',createdAt:new Date().toISOString()}}).then(()=>{['cp-text','cp-pid','cp-type'].forEach(k=>delete FM[k]);toast('وصلت شكواك للإدارة');fillAccount()},e=>{FM['cp-err']=canWriteMsg(e);fillAccount()})}
  else if(act==='cp-ok'){const note=(($('#cpn-'+a.dataset.id)||{}).value||'').trim();writeDoc('complaints',a.dataset.uid,n=>{const c=n.items[a.dataset.id];if(c){c.status='resolved';c.reply=note}}).then(()=>toast('تم إغلاق الشكوى'),()=>toast('تعذّر الإجراء'))}
  else if(act==='cp-place'){FM['cp-pid']=a.dataset.id;go('account')}
  else if(act==='pt-send')partnerSend();
  else if(act==='am-send')ambSend();
  else if(act==='in-tab'){IN.tab=a.dataset.t;fillInsights()}
  else if(act==='ptm')ptModerate(a.dataset.k,a.dataset.uid,a.dataset.id);
  else if(act==='amm')ambModerate(a.dataset.k,a.dataset.uid);
  else if(act==='amm-pub')ambPublish();
  else if(act==='cm-save')campCreate();
  else if(act==='cmm'){const id=a.dataset.id;if(a.dataset.k==='tog')writeSetting('campaigns',it=>{if(it[id])it[id].active=!it[id].active}).catch(()=>toast('تعذّر الإجراء'));else if(sure(a,'حذف'))writeSetting('campaigns',it=>{delete it[id]}).then(()=>toast('حُذفت الحملة'),()=>toast('تعذّر الحذف'))}
  else if(act==='csv-pt')csvPartners();
  else if(act==='csv-am')csvAmb();
  else if(act==='csv-cm')csvCamp();
  else if(act==='acc-save')accSave();
  else if(act==='acc-new'){ACC.draft=newDraft();ACC.edit=null;ACC.err='';fillAccount()}
  else if(act==='acc-edit'){const i=ACC.items[a.dataset.id];if(i){ACC.edit=i.id;ACC.err='';ACC.draft=Object.assign(newDraft(),i,{price:i.price==null?'':String(i.price),lat:i.lat==null?'':String(i.lat),lng:i.lng==null?'':String(i.lng),a:Object.assign({},i.a||{}),amen:(i.amen||[]).slice()});fillAccount();window.scrollTo(0,0)}}
  else if(act==='acc-del'){if(sure(a,'حذف'))DB.doc('submissions/'+ACC.uid+'/items/'+a.dataset.id).delete().then(()=>{if(ACC.edit===a.dataset.id){ACC.edit=null;ACC.draft=newDraft()}toast('تم الحذف')},()=>toast('تعذّر الحذف'))}
  else if(act==='acc-profile')accProfile();
  else if(act==='rv-ok'||act==='rv-no'||act==='rv-off')review(act.slice(3),a.dataset.uid,a.dataset.id,a);
  else if(act==='pr-save')savePricing();
  else if(act==='adm-save')admSave();
  else if(act==='adm-base')admBase();
  else if(act==='qr-dl')qrDownload(a.dataset.kind,a.dataset.id);
  else if(act==='adm-test'){const p=PLID[a.dataset.id];if(p&&p.tour)openTour(p.id)}
  else if(act==='adm-edit'){const t=TOURS[a.dataset.id];ADM.sel=a.dataset.id;ADM.prov=t.provider||'kuula';ADM.parsed={tourId:t.tourId,embedUrl:t.embedUrl};fillAdmin();const k=$('#kin');if(k)k.value=t.embedUrl;window.scrollTo(0,0)}
  else if(act==='adm-del'){const id=a.dataset.id;if(a.dataset.sure!=='1'){a.dataset.sure='1';a.textContent='تأكيد الحذف';setTimeout(()=>{if(a.isConnected){a.dataset.sure='';a.textContent='حذف'}},4000)}else{DB.doc('tours/'+id).delete().then(()=>toast('تم حذف الجولة'),()=>toast('تعذّر الحذف'))}}
  else if(act==='login'&&window.JW_AUTH)JW_AUTH.open({mode:'login'});
  else if(act==='logout'&&window.JW_AUTH)JW_AUTH.logout();
  else if(act==='search')openSearch();
  else if(act==='menu')openDrawer(SECT[curRaw().split('-')[0]]);
  else if(act==='closeov')closeOverlays();
  else if(act==='copy')copyText(a.dataset.text,a.dataset.toast||'تم النسخ');
  else if(act==='reset')resetListing(a.dataset.id);
  else if(act==='showmap'){const p=PLID[a.dataset.id];go('map',{city:p.city,sel:p.id,cat:'',view:'map'})}
  else if(act==='gal'){const p=PLID[a.dataset.id],k=+a.dataset.k;$('#gmain').style.backgroundImage=`url('${img(p,k,1200,900)}')`;document.querySelectorAll('[data-act=gal]').forEach(b=>b.setAttribute('aria-pressed',String(b===a)))}
});
function onField(e){
  const el=e.target.closest('[data-l][data-f]');if(!el||el.dataset.v!==undefined||el.classList.contains('fchip'))return;
  const L=LST[el.dataset.l];if(!L)return;const fld=el.dataset.f;
  L.st[fld]=el.value;if(fld==='cat')L.st.price='';
  if(fld==='city'){L.st.mapCity=el.value||'';L.st.sel=''}
  refresh(el.dataset.l);
}
app.addEventListener('input',e=>{
  if(bk2OnInput(e))return;
  {const id=e.target.id||'';if(/^(cp|of|rv|pt|am|cm)-/.test(id)){FM[id]=e.target.value;return}}
  if(e.target.id==='oq'){updateOverlaySearch(e.target.value);return}
  if(e.target.matches('input[data-f=q]'))onField(e);
});
app.addEventListener('change',e=>{
  if(bk2OnChange(e))return;
  if(e.target.matches('[data-acc=ocpid]')){OC.pid=e.target.value;OC.sel=null;fillAccount();return}
  if(e.target.id==='cm-kind'){FM['cm-kind']=e.target.value;delete FM['cm-target'];fillInsights();return}
  if(/^(cp|of|pt|am|cm)-/.test(e.target.id||'')){FM[e.target.id]=e.target.value;return}
  if(e.target.matches('[data-acc]')){readForm();if(e.target.dataset.acc==='cat')ACC.draft.a={},ACC.draft.amen=[];fillAccount();return}
  if(e.target.matches('[data-vf]')){admVerify(e.target.dataset.vf,e.target.checked);return}
  const d=e.target.closest('[data-adm]');
  if(d){if(d.dataset.adm==='sel'){ADM.sel=d.value;ADM.parsed=null}else{ADM.prov=d.value;ADM.parsed=null}fillAdmin();return}
  if(e.target.matches('select'))onField(e)});
app.addEventListener('submit',e=>{
  const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();
  if(f.dataset.form==='b2f'){b2fApply();return}
  if(f.dataset.form==='hsearch'){go('explore',{q:$('#hq').value.trim()})}
  else if(f.dataset.form==='osearch'){const q=$('#oq').value.trim();closeOverlays();go('explore',{q})}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOverlays()});
route();
initCaps();
})();
