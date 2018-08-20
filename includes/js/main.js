/*********************************** Global variables ************************/

// Calculating scroll (to bottom scroll) variable
var scrollHeight = 0;

// Document element variable
var docElement;

// Main section 
var main;
var mainContent;

// Navigation references
var navRefs;
var nNavRefs;

// XMLHttpRequest initialization
var xhr = new WebSocket();

// Cycle parametres
var i;

// Self object
var self;

// Scroll arrow; header, nav, wrapper offsets for resizing
var scrollArrow;
var scrollArrowParent;
var header;
var nav;
var wrapper;
var offsetMain;
var wrapperOffset;

// Logo
var logo;

// Title
var title = 'ЗаборМос - заборы по разумным ценам';

// Highslide
var media = {slideshowGroup: 'media'};
var project = {slideshowGroup: 'project'};
var g1 = {slideshowGroup: 'g1'};
var g4 = {slideshowGroup: 'g4'};
var w1 = {slideshowGroup: 'w1'};

hs.dimmingOpacity = 0.8;
hs.transitions = ['expand', 'crossfade'];
hs.fadeInOut = true;
hs.maxHeight = 500;
hs.align = 'center';
      
hs.registerOverlay({
    html: '<div class="closebutton" onclick="return hs.close(this)" title="Закрыть"></div>',
    position: 'top right',
    fade: 2 
});  
      
hs.addSlideshow({
    slideshowGroup: ['media', 'project', 'g1', 'g4', 'w1'],
    interval: 5000,
    repeat: false,
    useControls: true,
    fixedControls: 'fit',
    overlayOptions: {
        opacity: 0.75,
        position: 'bottom center',
        hideOnMouseOut: true
    }
});

// Display size
var screenMd = 750;


/******************************* Application *********************************/

var application = {
    
    // Initialization function
    
    initialize: function()
    {
        /********** Variables initialization *********/
        
        // Standard self object
        self = this;
        
        // Document element
        docElement = document.documentElement;
                                     
        // Main section initialization
        main = document.querySelector('.main'); 
        mainContent = main.querySelector('.main__content'); 
        offsetMain = self.getOffsetRect(main);

        // Wrapper
        wrapper = document.querySelector('.wrapper');
        
        // Offset wrapper
        wrapperOffset = self.getOffsetRect(wrapper);

        // Scroll button and its parent
        scrollArrow = document.querySelector('.scroll i');
        scrollArrowParent = scrollArrow.parentNode;
        
        // Navigation bar
        nav = document.querySelector('.nav');
        
        // Navigation references initialization
        navRefs = document.querySelectorAll('.nav > a');
        nNavRefs = navRefs.length;
        
        // Header
        header = document.querySelector('.header');
        
        // Logo initialization
        logo = document.querySelector('.logo');
        
        var footerRefs = document.querySelectorAll('.footer i');
        var nFooterRefs = footerRefs.length;
 
        
        /*********************** Handlers *********************/
        
        // Navigation panel
        function navClick(e) 
        {          
            if (!this.classList.contains('active')) {
                this.flag = true;
                self.openMainText(this);
            }
            
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Aside panel
        function asideClick(e) 
        {            
            if (!this.classList.contains('active')) {
                this.flag = true;
                self.openSubMainText(this);         
            }
            
            e.preventDefault();
            e.stopPropagation();   
        } 
        
        // Aside button click 
        function asideButtonClick(e)
        {
            var windowWidth = window.innerWidth;
            var aside = this.parentNode;
            var asideNav = aside.querySelector('.aside__nav');
            
            if (asideNav.style.display == 'block') {
                this.style.backgroundImage = 'url(../includes/img/elements/cl-menu.png)';
                this.style.marginLeft = '-2px';
                this.style.width = '15px';
                
                asideNav.style.display = 'none';
                
                aside.style.width = 'auto';
            }
            else {
                this.style.backgroundImage = 'url(../includes/img/elements/hv-menu.png)';
                this.style.marginLeft = '0';
                this.style.width = '100%';
            
                asideNav.style.display = 'block';
                
                aside.style.width = '100%';
            }
            
            e.preventDefault();
            e.stopPropagation();   
        }
        
        // Footer buttons
        function footerClick(e) 
        {      
            var windowWidth = window.innerWidth;
            
            if (windowWidth <= screenMd) {
                var p = this.parentNode.querySelector('p');
                if (p.style.display == 'block') {
                    self.removeClass(this,'active');
                    p.style.display = 'none';   
                }
                else {
                    self.addClass(this,'active');
                    p.style.display = 'block';
                }
            }
            
            e.preventDefault();
            e.stopPropagation();   
        } 
        
        // Scrolling function for Highslide images
        function hsClickScroll()
        {
            var imageOffset = self.getOffsetRect(this).top; 
            var clientOffset = (docElement.clientHeight-hs.maxHeight) / 2;
            window.scrollTo(0,imageOffset-clientOffset);
        }   
        
        // Scrolling button
        function scrollBy(e)
        {
            self.scrollBy();
            
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Updating state
        function updateState() 
        {
            if (history.state === null) {
                routing();
                return false;
            }
            self.updateState(history.state);
        }
        
        // Scrolling
        function scrolling() 
        {     
            var scrollTop = window.pageYOffset || docElement.scrollTop;
            
            // Navigation and aside-navigation unfixed/fixed position
            var aside = document.querySelector('.aside');
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            
            // Footer button closed
            var p;
            if (windowWidth <= screenMd)
                for (i = 0; i < nFooterRefs; ++i) {
                    p = footerRefs[i].parentNode.querySelector('p');

                    if (p.style.display == 'block') {
                        p.style.display = 'none';
                        footerRefs[i].style.borderColor = '#64c639';
                        footerRefs[i].style.color = '#64c639';
                    }
                }
            
            if (aside && windowWidth > screenMd && scrollTop >= offsetMain.top)
                aside.style.position = 'fixed';
            else if (aside && windowWidth > screenMd && aside.style.position == 'fixed')
                aside.style.position = 'static';
            else if (aside && windowWidth <= screenMd && aside.style.position == 'static')
                aside.style.position = 'fixed';

            // Style scroll button changing
            if (scrollTop < offsetMain.top) {     
                if (scrollArrowParent.classList.contains('scrollBy') && scrollTop == 0) {
                    self.removeClass(scrollArrowParent, 'scrollBy');
                    self.removeClass(scrollArrow,'fa-angle-double-up');
                    self.addClass(scrollArrow,'fa-angle-double-down');
                    
                    scrollArrowParent.style.display = 'block';
                }
                else 
                    scrollArrowParent.style.display = 'none';
            }
            else if (scrollTop > offsetMain.top) {
                scrollArrowParent.style.display = 'block';
                
                self.removeClass(scrollArrow,'fa-angle-double-down');
                self.addClass(scrollArrow,'fa-angle-double-up');
                
                scrollHeight = scrollTop;
            }
        }    
        
        // Resizing 
        function resizing(){
            var p;
            var windowWidth = window.innerWidth;
            if (windowWidth > screenMd)
                for (i = 0; i < nFooterRefs; ++i) {
                    p = footerRefs[i].parentNode.querySelector('p');
                    
                    if (footerRefs[i].style.color != '#64c639') {
                        footerRefs[i].style.borderColor = '#64c639';
                        footerRefs[i].style.color = '#64c639';
                    }
                    
                    if (p.style.display == 'none') {
                        p.style.display = 'block';
                    }
                }
            else
                for (i = 0; i < nFooterRefs; ++i) {
                    p = footerRefs[i].parentNode.querySelector('p');
                    
                    if (footerRefs[i].style.color != '#64c639') {
                        footerRefs[i].style.borderColor = '#64c639';
                        footerRefs[i].style.color = '#64c639';
                    }
                    
                    if (p.style.display == 'block') {
                        p.style.display = 'none';
                    }
                }
        }
        
        // Table collapsing
        function tableCollapse(e) 
        {
            self.tableCollapse(this);
            
            e.preventDefault();
            e.stopPropagation();
        }
 
        // Routing 
        function routing() 
        {
            var hash = document.location.hash;
            var hashList = hash.slice(3).split('/');
            var nHashList = hashList.length;
            var startHrefIndex = navRefs[0].href.indexOf('#') + 3;
            var link, linkTitle;
            
            var search = document.location.search;        
            if (!search) {
                if (hash == "" || hash == "#!/index") {
                    if (hash == "")
                        link = document.location.href+'#!/index';
                    else
                        link = document.location.href;
                    linkTitle = title;
                    history.replaceState({title:linkTitle, href:link}, null, link);
                }
                else {
                    link = document.location.href;

                    for (i = 0; i < nNavRefs; ++i)
                        if (navRefs[i].href.slice(startHrefIndex) == hashList[0]) {
                            linkTitle = navRefs[i].innerText;
                            startHrefIndex = navRefs[i].href.length + 1; 
                            break;
                        }
                    
                    asideRefs = link.slice(startHrefIndex);

                    if (asideRefs == 'fences')
                        linkTitle = linkTitle + ' (заборы)';
                    else if (asideRefs == 'gates') {
                        linkTitle = linkTitle + ' (ворота)';
                    }
                    else if (asideRefs == 'wickets')
                        linkTitle = linkTitle + ' (калитки)';
                    
                    history.replaceState({title:linkTitle, href:link}, null, link);
                }
                
                self.updateState(history.state);
            }
            else if (search.indexOf('?_escaped_fragment_=') == 0) {
                var page, pageParts, nPageParts;
                var locHref = document.location.href;
                var startSearchIndex = locHref.indexOf('?_escaped_fragment_=');
                startHrefIndex = search.indexOf('=') + 2;
                pageParts = search.slice(startHrefIndex).split('/');
                nPageParts = pageParts.length;       
                if (pageParts[0])
                    page = 'pages/' + pageParts[0] + '/' + pageParts[0] + '.html';               
                else
                    page = 'pages/index/index.html';
                    
                
                document.location.href = locHref.slice(0,startSearchIndex) + page;
            }
                
        }
        
        
        /********************* Listeners and actions ********************/    
        
        for (i = 0; i < nNavRefs; ++i)
            navRefs[i].addEventListener('click', navClick, false);  

        for (i = 0; i < nFooterRefs; ++i)
            footerRefs[i].addEventListener('click', footerClick, false); 
        
        scrollArrow.addEventListener('click', scrollBy, false);
        
        document.querySelector('.logo').addEventListener('click', navClick, false);
        
        $(main).on('click', '.aside__nav > a', asideClick);
        
        $(main).on('click', '.aside__button', asideButtonClick);
        
        $(main).on('click', '.table-collapse', tableCollapse);
        
        $(main).on('click', '.highslide', hsClickScroll);
        
        window.addEventListener('popstate', updateState, false);
        
        window.addEventListener('scroll', scrolling, false);
        
        window.addEventListener('resize', resizing, false);
        
        // Routing
        routing();
    },
    
    
    /************************** Routing functions **************************/
    
    // To load text after navigation bar's button was clicked
    openMainText: function(e) 
    {
        var startHrefIndex = e.href.indexOf('#') + 3;
        var ref = e.href.slice(startHrefIndex);
        
        xhr.open('GET', '/pages/'+ref+'/'+ref+'.html', true);
        xhr.onload = function() 
        {
            if (xhr.status == 200 || xhr.status == 304) {
                this.data = xhr.responseText;
                mainContent.innerHTML = this.data;
                               
                // Showing map
                if (ref == 'contacts')
                    self.showMap(1);
                else
                    self.showMap(0);
                
                // Navigation reference style
                if (ref == 'index') {                    
                    for (i = 0; i < navRefs.length; ++i)
                        if (navRefs[i].classList.contains('active')) {
                            self.removeClass(navRefs[i],'active');
                            break;
                        }
                }
                else {
                    active = e.parentNode.querySelector('.active');
                    if (active)
                        self.removeClass(active,'active');
                    self.addClass(e,'active');
                }
                
                // Scrolling
                window.scrollTo(0,0);
                self.removeClass(scrollArrowParent,'scrollBy');
                
                // Registration URL if it did not yet
                if (e.flag === true)                    
                    self.registerURL(e,'main');   
                // Loading aside text when popstate event was fired
                else if (e.asideHref) {
                    asideRefs = document.querySelectorAll('.aside__nav a');
                    nAsideRefs = asideRefs.length;

                    var updAsideRef;
                    startHrefIndex = asideRefs[0].href.indexOf('#') + 3;
                    for (i = 0; i < nAsideRefs; ++i)
                        if (asideRefs[i].href.slice(startHrefIndex).split('/')[1] == e.asideHref) {
                            updAsideRef = asideRefs[i];
                            break;
                        }
                            
                    updAsideRef.flag = false;
                    self.openSubMainText(updAsideRef);
                }
            } 
            else
                alert(xhr.status+': '+xhr.statusText); 
        }
        xhr.send();
    },

    // To load text after aside bar's button was clicked
    openSubMainText: function(e) 
    {
        var startHrefIndex = e.href.indexOf('#') + 3;
        var idAsideSection = '#' + e.href.slice(startHrefIndex).split('/')[1]; 
        var asideMain = document.querySelector(idAsideSection);   
        var active = e.parentNode.querySelector('.active');
        
        startHrefIndex = active.href.indexOf('#') + 3;
        var idAsideSectionActive = '#' + active.href.slice(startHrefIndex).split('/')[1]; 
        var asideMainActive = document.querySelector(idAsideSectionActive);
        
        this.addClass(asideMainActive,'hidden');
        this.removeClass(asideMain,'hidden');
        this.removeClass(active,'active');
        this.addClass(e,'active');

        if (e.flag)
            this.registerURL(e,'submain');
        
        // Scrolling to content
        var scrollOffset = self.getOffsetRect(document.querySelector(idAsideSection));
        window.scrollTo(scrollOffset.left, scrollOffset.top);
    },

    // Registration of URL if it has not yet   
    registerURL: function(e,type)
    {
        var ref = e.href;
        var hash = document.location.href;
        var link, linkTitle;
        
        if (type=='main') {
            var asideActive = document.querySelector('.aside__nav .active');
            
            if (asideActive)
                link = asideActive.href;
            else 
                link = ref;
            if (hash != link) {
                if (asideActive)
                    linkTitle = e.innerText + ' (' + asideActive.innerText + ')';   
                else
                    linkTitle = e.innerText ? e.innerText : title;
                history.pushState({title:linkTitle, href:link}, null, link);
                document.title = linkTitle;
            }
        }
        else if (type=='submain') {
            var navRefActive;
            for (i = 0; i < nNavRefs; ++i)
                if (navRefs[i].classList.contains('active'))
                    navRefActive = navRefs[i];
                
            link = ref;
            if (hash != link) {
                linkTitle = navRefActive.innerText + ' (' + e.innerText + ')';
                history.pushState({title:linkTitle, href:link}, null, link);
                document.title = linkTitle;
            }    
        }
    },

    // Update state by popstate, and new load
    updateState: function(state)
    {
        var startHrefIndex = state.href.indexOf('#') + 3;
        var refParts = state.href.slice(startHrefIndex).split('/');
        var nRefParts = refParts.length;
        document.title = state.title;
        
        var updNavRef;
        for (i = 0; i < nNavRefs; ++i)
            if (navRefs[i].href.slice(startHrefIndex) == refParts[0]) {
                updNavRef = navRefs[i];
                break;
            }

        if (logo.href.slice(startHrefIndex) == refParts[0])
            updNavRef = logo;
        
        if (updNavRef) {
            updNavRef.flag = false;
            if (nRefParts > 1)
                updNavRef.asideHref = refParts[1];
            self.openMainText(updNavRef);
        }
    },
    
    
    /************************** Content manipulations' functions *************************/
    
    // Collapsing of the tables
    tableCollapse: function(e) 
    {
        var trs = e.parentNode.parentNode.querySelectorAll('tr');
        var nTrs = trs.length;
        if (e.classList.contains('closed')) {
            this.removeClass(e,'closed');

            for(i = 0; i < nTrs; ++i) {
                trs[i].style.display = 'table-row';
            }
        }
        else {
            this.addClass(e,'closed');
            for(i = 1; i < nTrs; ++i)
                trs[i].style.display = 'none';
        }
    },

    // Scrolling button 
    scrollBy: function()
    {
        var self = this;
        var scrollTop = window.pageYOffset || docElement.scrollTop;
        
        if (scrollTop != 0) {
            self.addClass(scrollArrowParent,'scrollBy');
            window.scrollBy(0,-scrollHeight);
        }
        else
            window.scrollBy(0,scrollHeight);        
    },
    
    // Showing map
    showMap: function(flag)
    {   
        var map = document.querySelector('.map');
        
        if (flag)
            map.style.display = 'block';
        else if (map.style.display == 'block')
            map.style.display = 'none';
    },
      
       
    /************************* Utility functions ***********************/
    
    // Remove class function
    removeClass: function(obj, cls) 
    {
        var classes = obj.className.split(' ');
        var nClasses = classes.length;
        for (i = 0; i < nClasses; ++i)
            if (classes[i] == cls) {
                classes.splice(i, 1); 
                i--;
            }
        obj.className = classes.join(' ');
    },
    
    // Add class function
    addClass: function(obj, cls) 
    {
        var classes = obj.classList;
        if (!classes.contains(cls))
            obj.className = obj.className + ' ' + cls;
    },
    
    // Get offset for scrolling button
    getOffsetRect: function (obj) 
    {
        docElement = document.documentElement;
        
        var box = obj.getBoundingClientRect();

        var body = document.body;
        
        var scrollTop = window.pageYOffset || docElement.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElement.scrollLeft || body.scrollLeft;
        
        var clientTop = docElement.clientTop || body.clientTop || 0;
        var clientLeft = docElement.clientLeft || body.clientLeft || 0;
        
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        
        return {top: Math.round(top), left: Math.round(left)}
    }
}


/*** Main actions ***/

window.application = application;
document.addEventListener('DOMContentLoaded', application.initialize(), true);


function Connector (params) {
    this._params = params,
	
	create: function () {
		
	},
    send: function() {
		
	},
	close: function() {
		
	}
}

class DBConnector(Connector):
    def __init__(self, params=None):
        init_params = {
            "host":  "fix-osr-db4.unix.tensor.ru",
            "dbname": "ext",
            "user": "viewer",
            "password": "Viewer1234"
        }
        if (params):
            init_params.update(params)

        super().__init__(init_params)
        self.db = None

    def __del__(self):
        self.close()

    def __db_connect(self, params=None, b_close=False):
        if (not self.db or b_close):
            self.__db_close()
            if (params):
                self._params.update(params)

            auth_params = "host='" + self._params["host"] + "' dbname='" + self._params["dbname"] + "' user='" + self._params["user"] + "' password='" + self._params["password"] + "'"
            try:
                self.db = psycopg2.connect(auth_params)
            except psycopg2.DatabaseError as e:
                if (self.db):
                    self.db.rollback()
                print('Error %s' % e)
                sys.exit(1)

    def __db_close(self):
        if (self.db):
            self.db.close()

    def __db_get(self, str):
        self._links.clear()
        cur = self.db.cursor()
        cur.execute(str)

        while True:
            row = cur.fetchone()
            if row == None:
                break
            self._links.append(row)

        return self._links

    def request(self, params=None):
        tmp_params = {
            "b_close": False,
            "b_save": True,
            "request": "",
            "file_name": "",
            "params": None
        }
        if (params):
            tmp_params.update(params)

        self.__db_connect(tmp_params["params"], tmp_params["b_close"])
        response = self.__db_get(tmp_params["request"])

        return response

    def close(self):
        self.__db_close()

class HTTPConnector(HTTPConnection, Connector):
    def __init__(self, params=None):
        init_params = {
            "server": {
                "host": "test-online.sbis.ru",
                "port": 80
            },
            "request": {
                "method": "POST",
                "url": "http://test-online.sbis.ru/auth/service/sbis-rpc-service300.dll",
                "headers": {
                    "Content-Type": "application/json; charset=UTF-8;",
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64)"
                                  " AppleWebKit/537.36 (KHTML, like Gecko)" +
                                  " Chrome/53.0.2785.143 Safari/537.36",
                    "Connection": "keep-alive"
                },
                "body": urlencode({ # TODO json.dumps is better?
                    "jsonrpc": "2.0",
                    "protocol": 4,
                    "method": "LinkDecorator.DecorateAsSvgExt",
                    "params": {
                        "LinksArray": ["https://habr.com/post/414971/",
                                       "https://pre-test-online.sbis.ru/opendoc.html?" +
                                       "guid=d012b11c-b521-4c34-a0ec-a904fb89f1e0"],
                        "login": "{}".format("Демо_тензор"),
                        "password": "{}".format("Демо123")
                    }
                })
            }
        }
        if (params):
            init_params.update(params)

        self._params = init_params
        self._links = []
        super().__init__(host=self._params["server"]["host"], port=self._params["server"]["port"])

    def request(self, params=None):
        tmp_params = {
            "files": ["uuid.csv", "domens.csv"],
            "params": None
        }
        if (params):
            tmp_params.update(params)

        if (tmp_params["params"]):
            self._params["request"].update(tmp_params["params"])

        super().request(method=self._params["request"]["method"], url=self._params["request"]["url"],
                        body=self._params["request"]["body"], headers=self._params["request"]["headers"])

        return self.load_from_files(tmp_params["files"])

    def load_from_files(self, files, n=10, m=1000):
        if (len(files) != 0):
            load_files = {"uuids": None, "domens": None}

            try:
                load_files["uuids"] = [line.strip() for line in open(files[0], 'r')]
                load_files["domens"] =  [line.strip() for line in open(files[1], 'r')]

            except IOError as e:
                print("Ошибка чтения файла при инициализации: ", e)

            n_uuids = len(load_files["uuids"])
            n_domens = len(load_files["domens"])
            for i in range(n):
                self._links.append([])
                for j in range(m):
                    rand_dom = randint(0,n_domens-1)
                    rand_uuid = randint(0,n_uuids-1)
                    link = '"http://%s"' % load_files["domens"][rand_dom]
                    self._links[-1].append(link)
                    link = '"https://test-online.sbis.ru/person/%s"' % load_files["uuids"][rand_uuid]
                    self._links[-1].append(link)
            return self._links
        else:
            return 0

    def get_response(self):
        try:
            response = self.getresponse()
            return response
        except Exception as e:
            print("Connection error: ", e)

    def close(self):
        pass

#abstractclass
class Printer:
    def __init__(self):
        pass

    def out(self, response, type, file_name=None, b_random=False, delim=","):
        pass

    def close(self):
        pass

class CSVPrinter(Printer):
    def __init__(self):
        super().__init__()

    def out(self, response, type, file_name=None, b_random=False, delim=","):
        if (type == 'console'):
            if (response.status == 200):
                data = json.loads(response.read())
                print(data)
            else:
                print("Error: ", response.status, response.reason)

        elif (type == 'file'):
            if (file_name):
                file_out_name = file_name
            else:
                file_out_name = "data.csv" # "out_" + str(datetime.now().strftime("%Y-%m-%d-%H.%M.%S")) + ".csv"

            file_out = open(file_out_name, 'a')
            for line in response:
                try:
                    line.isalpha()
                    rec = ""
                    for elem in line:
                        rec += elem + delim
                    file_out.write(rec[:-1] + ';')
                except:
                    rec = line
                    if (isinstance(rec,tuple)):
                        rec = tuple(item.replace("\"","\'").replace("\\","\\\\") if isinstance(item,str) else item for item in rec)

                        if (len(rec) == 1 and b_random):
                            b_xlist = choice([True,False])
                            b_plain = False if b_xlist else choice([True,False])
                            b_def = True if b_xlist == b_plain else False
                            file_out.write((('%s'+delim)*3+'%s\n') % (rec[0],str(b_xlist).lower(),str(b_plain).lower(),str(b_def).lower()))
                        else:
                            out_format_str = str(('%s'+delim) * len(rec))[:-1] + '\n'
                            file_out.write(out_format_str % rec)
                    elif (isinstance(rec,int)):
                        out_format_str = '%s\n'
                        file_out.write(out_format_str % rec)
                    else:
                        return 0

        elif (type == 'massive'):
            query_face_ids = ', '.join([str(link[0]) for link in response])
            return query_face_ids

        else:
            pass

    def close(self):
        pass

class Tester:
    def __init__(self, connector=None, printer=None):
        self.connector = connector if connector else Connector()
        self.printer = printer if printer else Printer()
        self.params = self.connector.get_params()

    def __enter__(self):
        return self
    #def __exec_console(self, command_line="ls -l"):
        #   python -u ..\utils\sleeps\sleep.py 120
    #    args = shlex.split(command_line)
    #    subprocess.Popen(args)

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connector.close()
        self.printer.close()
        if exc_val:
            raise


    def link_decorator_test(self, files=None):
        self.console_log()
        response = self.request()
        self.printer.out(response, "file")

        #command_line = r'echo LinkDecorator test \
        #    call jmeter -n -t .\scripts\link_decor.jmx -l scripts\Reports\linkdecorator.jtl \
        #    python -u ..\utils\apdex_jmeter\apdex.py -l "scripts\Reports\linkdecorator.jtl" -f "scripts\Reports\APDEX_linkdecorator" --new --read "readme.txt"'
        #self.__exec_console(command_line)

    def process_vas_test(self):
        request = 'SELECT "ПроцессВАС", COALESCE("Контрагент", 0) "Контрагент" FROM "СвязьЛицаСуд" WHERE "ТипСвязи" IN (7, 8) LIMIT 1000'
        file_name = "data1.csv"
        response = self.request({"request": request, "file_name": file_name})
        self.printer.out(response, "file", file_name)

        request = 'SELECT "@Лицо" "Суд" FROM "АрбитражныйСуд"'
        response = self.request({"request": request, "file_name": file_name})

        request = 'SELECT DISTINCT ON ("Контрагент") "Контрагент" FROM "СвязьЛицаСуд" WHERE "ТипСвязи" IN (7, 8) AND "Контрагент" > 0 LIMIT 1000'
        file_name = "data2.csv"
        response = self.request({"request": request, "file_name": file_name})
        self.printer.out(response, "file", file_name, True)
        # Повторяем запрос, чтобы избежать кэширования данных
        #response = self.request({"request": request, "b_save": False})
        #query_face_ids = self.printer.out(response, "massive")
        #params = {
        #    "host":  "test-spp-db2.unix.tensor.ru",
        #    "dbname": "agentcheck",
        #    "user": "service_user",
        #    "password": "iiS"
        #}
        #request = 'SELECT "ОГРН" FROM "Контрагент" WHERE "@Лицо" IN (' + query_face_ids + ')'
        request = 'SELECT DISTINCT ON ("Контрагент") "Контрагент" FROM "СвязьЛицаСуд" WHERE "ТипСвязи" IN (7, 8) AND "Контрагент" > 0 LIMIT 3000'
        file_name = "data4.csv"
        response = self.request({"request": request, "file_name": file_name})
        self.printer.out(response, "file", file_name, True)

    def staff_statistics_test(self):
        #StaffStatistics.AgeList
        #StaffStatistics.ChildrenList
        #StaffStatistics.ChildrenListForPrint
        #StaffStatistics.ExperienceList
        #StaffStatistics.FiredList
        #StaffStatistics.GenderList
        #StaffStatistics.HiredList
        #StaffStatistics.LongtimersList
        #StaffStatistics.ProbationList
        #StaffStatistics.TurnoverList
        #StaffStatistics.WorkersList
        #StaffStatistics.DepartmentList
        #StaffStatistics.GetChildren
        #StaffStatistics.GetDocTypeId
        #StaffStatistics.Main
        #StaffStatistics.Update
        pass

    def lps_test(self):
        request = 'SELECT "@Номенклатура", "Наименование" FROM "_000b28b5"."Номенклатура" LIMIT 1000'
        file_name = "data1.csv"
        response = self.request({"request": request})
        #print(response)
        #response = [(res[0], res[1], randint(0,22700)) for res in response]
        self.printer.out(response, "file", file_name)

        request = 'SELECT "@Номенклатура" FROM "_000b28b5"."Номенклатура" LIMIT 2000'
        file_name = "data2.csv"
        response = self.request({"request": request})
        def random(arr,n,m):
            l = len(arr)
            tmp_arr = []
            item = None
            for i in range(n):
                rand_b = randint(0,l-m)
                rand_e = rand_b + m
                item = [str(i[0]) for i in arr[rand_b:rand_e]]
                tmp_arr.append((",".join(item),))
            return tmp_arr
        file_name = "data2.csv"
        response = random(response,1000,10)
        self.printer.out(response, "file", file_name)
        tmp_response = []
        for item in response:
            tmp_item = item[0].split(",")
            for i in list(tmp_item):
                tmp_response.append(int(i))
        file_name = "data3.csv"
        self.printer.out(tmp_response, "file", file_name)


        #request = 'SELECT DISTINCT ON ("Контрагент") "Контрагент" FROM "СвязьЛицаСуд" WHERE "ТипСвязи" IN (7, 8) AND "Контрагент" > 0 LIMIT 1000'
        #file_name = "data3.csv"
        #response = self.request({"request": request, "file_name": file_name})
        #self.printer.out(response, "file", file_name, True)

    def spp_events_test(self):
        db_config = {
            "host":  "test-spp-db2.unix.tensor.ru",
            "dbname": "agentcheck",
            "user": "service_user",
            "password": "iiS"
        }
        request = 'SELECT "@Лицо" FROM "Контрагент" WHERE coalesce("Reliability", 0) > 50 AND "@Лицо" > 0 LIMIT 900'
        response = self.request({"request": request,
                                 "params": db_config})
        file_name = "data1.csv"
        self.printer.out(response, "file", file_name)
        #file_name = "data2.csv"
        #self.printer.out(response[300:600], "file", file_name)
        #file_name = "data3.csv"
        #self.printer.out(response[600:], "file", file_name)

    def service_center_auto_test(self):
        db_config = {
            "host":  "test-spp-db2.unix.tensor.ru",
            "dbname": "agentcheck",
            "user": "service_user",
            "password": "iiS"
        }
        request = 'SELECT "@Лицо" FROM "Контрагент" WHERE coalesce("Reliability", 0) > 50 AND "@Лицо" > 0 LIMIT 1000'
        file_name = "data1.csv"
        response = self.request({"request": request,
                                 "params": db_config})
        self.printer.out(response, "file", file_name)

    def spp_sphinx_test(self):
        db_config = {
            "host":  "test-spp-db2.unix.tensor.ru",
            "dbname": "agentcheck",
            "user": "service_user",
            "password": "iiS"
        }
        request = 'SELECT "Название" FROM "Контрагент" LIMIT 1000'
        file_name = "data1.csv"
        response = self.request({"request": request,
                                 "params": db_config})
        response = [(str(item[0]).replace("\"", "\\\""),) for item in response]
        self.printer.out(response, "file", file_name)

    def spp_monitoring_test(self):
        db_config = {
            "host":  "test-spp-db2.unix.tensor.ru",
            "dbname": "sppm",
            "user": "service_user",
            "password": "iiS"
        }
        request = 'SELECT "Robot"."ServiceName", "Metric"."MetricName" FROM "Metric" LEFT JOIN "Robot" ON "Metric"."Robot"="Robot"."@Robot" LIMIT 1000'
        file_name = "data1.csv"
        response = self.request({"request": request,
                                 "params": db_config})
        dates = [(datetime(1900, i+1, 1, i, i, i, i).isoformat(sep=" "), datetime(2018, i+1, 28, i, i, i, i).isoformat(sep=" ")) for i in range(12)] * 100
        response = [item[0]+item[1] for item in zip(response, dates)]
        self.printer.out(response, "file", file_name)
        #MonitoringService.RobotsAndMetricsList
        #MonitoringMetrics.InsertFromClient
        #RequestState.InsertFromClient

    def billing_main_test(self):
        db_config = {
            "host":  "test-reg-db.unix.tensor.ru",
            "dbname": "reg.tensor.ru",
            "user": "viewer",
            "password": "Viewer1234"
        }

        def get_random_items(n):
            dates = (('2017-10-01', '2017-12-31'),
                     ('2018-01-01', '2018-03-31'),
                     ('2018-04-01', '2018-06-30'),
                     ('2018-07-01', '2018-09-30'))
            owners = ('1,СтруктураПредприятия', '17914,ЧастноеЛицо', '23472171,ЧастноеЛицо')

            for i in range(n):
                owner = choice(owners)
                date = choice(dates)

                yield (owner, date[0], date[1])

        response = [item for item in get_random_items(1000)]
        file_name = "data1.csv"
        self.printer.out(response, "file", file_name, delim=' ')

        request = ''
        request += 'SELECT\r\n'
        request += '    "Параметры" params,\r\n'
        request += '    "КлиентСБиС" account\r\n'
        request += 'FROM "Начисление"\r\n'
        request += 'WHERE "Тип" = 11\r\n'
        request += 'ORDER BY "@Начисление"'

        def get_parse_item(item):
            json_b = item[0]
            reg_id = json_b["reg_id"]
            date_begin = json_b["real_begin_date"] if getattr(json_b, "real_begin_date", None) else json_b["begin_date"]
            date_begin = [int(item) for item in date_begin.split("-")]
            date_end = json_b["real_end_date"] if getattr(json_b, "real_end_date", None)  else json_b["end_date"]
            date_end = [int(item) for item in date_end.split("-")]

            dates_pair = (datetime(*date_begin).timestamp(), datetime(*date_end).timestamp())
            dates_pair = [item for item in range(int(dates_pair[0]), int(dates_pair[1] + 86400), 86400)]
            dates = [datetime.fromtimestamp(date).date() for date in dates_pair]

            return [(reg_id, item[1], date) for date in dates]

        file_name = "data2.csv"
        response = self.request({"request": request,
                                 "params": db_config})

        result = []
        for item in response:
            result.extend(get_parse_item(item))

        self.printer.out(result, "file", file_name)

    def history_test(self):
        db_config = {
            "host":  "test-osr-ah-db2.unix.tensor.ru",
            "dbname": "history2",
            "user": "viewer",
            "password": "Viewer1234"
        }
        request = 'SELECT "Объект" FROM "ИсторияОбъект" LIMIT 2000'
        file_name = "data1.csv"
        response = self.request({"request": request,
                                 "params": db_config})
        self.printer.out(response, "file", file_name)

    def request(self, params=None):
        return self.connector.request(params)

    def console_log(self, params=None):
        response = self.connector.get_response()
        print(response)
        #self.printer.out(response, "console")

def __main__():
    connectors = [DBConnector(), HTTPConnector()]
    printers = [CSVPrinter()]
    tests = [
        'link_decorator_test',
        'process_vas_test',
        'staff_statistics_test',
        'lps_test',
        'spp_events_test',
        'service_center_auto_test',
        'spp_sphinx_test',
        'spp_monitoring_test',
        'billing_main_test',
        'history_test'
    ]

    with Tester(connectors[0], printers[0]) as tester:
        current_test = getattr(tester, tests[-1])
        current_test()
















