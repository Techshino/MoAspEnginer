var Debugs=[],Models=[],Connections={},UseCommand=false,PutDebug=function(a){Debugs.push(a)};var _helper=require("model_defines.js");var DataTable=_helper.DataTable;var DataTableRow=_helper.DataTableRow;function Model__(b,d,c,a){Models.push(new __Model__(b,d,c,a));return Models[Models.length-1]}Model__.helper=_helper;Model__.defaultDBConf="DB";Model__.defaultPK="id";Model__.allowDebug=false;Model__.lastRows=-1;Model__.useCommand=function(a){UseCommand=!!a};Model__.setDefault=function(a){Model__.defaultDBConf=a||"DB"};Model__.setDefaultPK=function(a){Model__.defaultPK=a||"id"};Model__.begin=function(a){Model__.getConnection(a).BeginTrans();return true};Model__.commit=function(a){Model__.getConnection(a).CommitTrans();return true};Model__.rollback=function(a){Model__.getConnection(a).RollbackTrans();return true};Model__.getConnection=function(a){a=a||Model__.defaultDBConf;if(Connections[a]===undefined){return null}return Connections[a].base};Model__.dispose=function(){while(Models.length>0){var d=Models.pop().dispose();d=null}for(var a in Connections){if(!Connections.hasOwnProperty(a)){continue}var d=Connections[a];try{var b=F.timer.run();d.base.close();if(Model__.allowDebug){PutDebug("database("+a+") disconnected.(time taken:"+F.timer.stop(b)+"MS)")}}catch(c){PutDebug("database("+a+") disconnect failed:"+c.message)}d.base=null;d=null}delete Connections;Connections={}};Model__.debug=function(){for(var a=0;a<Debugs.length;a++){ExceptionManager.put((a+1)|3674210304,"DBLOG",Debugs[a],E_INFO)}};Model__.Debug=function(a){Model__.allowDebug=!!a};Model__.connect=function(a){var e=null;var d=null;if(Connections.hasOwnProperty(a)){d=Connections[a].base;if(d.state==1){return true}e=Connections[a].cfg}else{e=Mo.Config.Global["MO_DATABASE_"+a];if(!e){return false}d=F.activex.connection();Connections[a]={name:a,cfg:e,base:d,mysqlUsed:false,useCommand:UseCommand,splitChars:["[","]"]};var c=_helper.Helper.GetConnectionString.call(e);if(c==""){PutDebug("database("+a+") connect failed:do not support '"+e.DB_Type+"' database type.");Model__.debug();return false}d.connectionstring=c}try{F.timer.run();if(Model__.allowDebug){PutDebug("connect to database("+a+"):"+d.connectionString)}d.open();if(Model__.allowDebug){PutDebug("database("+a+") connect successfully.(time taken:"+F.timer.stop()+"MS)")}if(!(e.DB_Type=="ACCESS"||e.DB_Type=="MSSQL"||!Mo.Config.Global.MO_LOAD_VBSHELPER)){Connections[a].useCommand=false}if(e.DB_Type=="MYSQL"){Connections[a].splitChars=["`","`"]}else{if((e.DB_Splitchars instanceof Array)&&e.DB_Splitchars.length==2){Connections[a].splitChars=e.DB_Splitchars}}return true}catch(b){PutDebug("database("+a+") connect failed:"+b.message);return false}return false};Model__.execute=function(c,a){a=a||Model__.defaultDBConf;if(!Model__.connect(a)){return -1}try{return Model__.RecordsAffected(Model__.getConnection(a),c)}catch(b){if(VBS&&VBS.ctrl.error.number!=0){ExceptionManager.put(VBS.ctrl.error.number,"__Model__.execute(sql[,cfg])",VBS.ctrl.error.description);VBS.ctrl.error.clear()}else{ExceptionManager.put(new Exception(b.number,"__Model__.execute(sql[,cfg])",b.message))}}};Model__.executeQuery=function(c,a){a=a||Model__.defaultDBConf;if(!Model__.connect(a)){return}try{return new DataTable(Model__.getConnection(a).execute(c))}catch(b){if(VBS&&VBS.ctrl.error.number!=0){ExceptionManager.put(VBS.ctrl.error.number,"__Model__.executeQuery(sql[,cfg])",VBS.ctrl.error.description);VBS.ctrl.error.clear()}else{ExceptionManager.put(new Exception(b.number,"__Model__.executeQuery(sql[,cfg])",b.message))}}};Model__.RecordsAffected=function(b,a){b.execute(a);return -1};Model__.RecordsAffectedCmd=function(b,c){var a=-1;if(c){Model__.lastRows=a;return b.execute()}else{b.execute();Model__.lastRows=a}};Model__.RecordsAffectedCmd_=function(a){return Model__.RecordsAffectedCmd(a.cmd,a.withQuery)};if(VBS&&Mo.Config.Global.MO_LOAD_VBSHELPER){VBS.execute("function RecordsAffected(byref conn,byval sqlstring)\r\n	conn.execute sqlstring,RecordsAffected\r\nend function");VBS.execute("function RecordsAffectedCmd_(byref opt)\r\n	dim RecordsAffectedvar\r\n	if opt.withQuery then\r\n		set opt.dataset = opt.cmdobj.execute(RecordsAffectedvar)\r\n		opt.affectedRows = RecordsAffectedvar\r\n	else\r\n		opt.cmdobj.execute RecordsAffectedvar\r\n		opt.affectedRows = RecordsAffectedvar\r\n	end if\r\nend function");Model__.RecordsAffected=VBS.getref("RecordsAffected");Model__.RecordsAffectedCmd_=VBS.getref("RecordsAffectedCmd_")}function __Model__(d,f,a,c){a=a||Model__.defaultDBConf;this.usecache=false;this.cachename="";this.table=F.string.trim(d||"");this.strcname="";if(this.table.indexOf(" ")>0){this.strcname=this.table.substr(this.table.indexOf(" ")+1);this.table=this.table.substr(0,this.table.indexOf(" "))}this.joinlevel="";this.fields="*";this.strwhere="";this.strgroupby="";this.strorderby="";this.pagekeyorder="yes";this.stron="";this.strjoin="";this.strlimit=-1;this.strpage=1;this.data={};this.pk=f||Model__.defaultPK;this.pagekey=this.pk;this.rc=0;this.rs__=null;this.object_cache=null;this.isonlypkorder=false;this.onlypkorder="asc";this.ballowOnlyPKOrder=true;this.base=null;this.tableWithNoSplitChar="";this.connection=null;if(!Model__.connect(a)){return}this.base=Connections[a];if(this.base.cfg.DB_Type=="MYSQL"&&!this.base.mysqlUsed){this.query("USE "+this.base.cfg.DB_Name);this.base.mysqlUsed=true}this.table=(c||(this.base.cfg.DB_TABLE_PERX||Mo.Config.Global.MO_TABLE_PERX))+this.table;this.tableWithNoSplitChar=this.table;if(this.base.useCommand){var e={},b="SCHMEA-"+a;if(Mo.C.Exists(b)){e=Mo.C(b)}this.base.cfg.DB_Schema=e;if(!this.base.cfg.DB_Schema[this.table]){this.base.cfg.DB_Schema[this.table]=_helper.Helper.GetColumns.call(this.base,this.table);Mo.C.SaveAs(b,e)}}if(this.base.cfg.DB_Type=="MSSQL"){this.table=this.base.splitChars[0]+this.base.cfg.DB_Name+this.base.splitChars[1]+"."+this.base.splitChars[0]+(this.base.cfg.DB_Owner||"dbo")+this.base.splitChars[1]+"."+this.base.splitChars[0]+this.table+this.base.splitChars[1]}else{this.table=this.base.splitChars[0]+this.table+this.base.splitChars[1]}this.connection=this.base.base}__Model__.prototype.getConnection=function(){return this.base.base};__Model__.prototype.allowOnlyPKOrder=function(a){this.ballowOnlyPKOrder=!(a===false);return this};__Model__.prototype.cache=function(a){this.usecache=true;this.cachename=a||"";return this};__Model__.prototype.field=function(){var b="";for(var a=0;a<arguments.length;a++){b+=arguments[a]+","}if(b!=""){b=b.substr(0,b.length-1)}if(b==""){b="*"}this.fields=b;return this};__Model__.prototype.where=function(a){if(a==undefined){return this}if(arguments.length<=0){return this}var d="("+arguments[0]+")",c="";for(var b=1;b<arguments.length;b++){c=arguments[b].substr(0,1);d="("+d+(c=="|"?" or ":" and ")+(c=="|"?arguments[b].substr(1):arguments[b])+")"}d=d.substr(1);d=d.substr(0,d.length-1);this.strwhere=d;return this};__Model__.prototype.orderby=function(a){if(typeof a=="object"){this.strorderby="";var b=this;F.foreach(a,function(d,c){b.strorderby+=b.base.splitChars[0]+d+b.base.splitChars[1]+" "+c+","});this.strorderby=F.string.trim(this.strorderby,",")}else{this.strorderby=F.string.trim(a||"")}if(this.strorderby!=""&&this.strorderby.indexOf(",")<0){if(this.strorderby.indexOf(" ")<0){this.strorderby=this.strorderby+" ASC"}if(F.string.startWith(this.strorderby.toLowerCase(),this.pk.toLowerCase())||F.string.startWith(this.strorderby.toLowerCase(),this.strcname.toLowerCase()+"."+this.pk.toLowerCase())||F.string.startWith(this.strorderby.toLowerCase(),this.table.toLowerCase()+"."+this.pk.toLowerCase())){this.isonlypkorder=true;this.onlypkorder=F.string.trim(this.strorderby.substr(this.strorderby.indexOf(" ")+1))}}return this};__Model__.prototype.groupby=function(a){this.strgroupby=a||"";return this};__Model__.prototype.limit=function(d,b,a,c){this.strlimit=b||-1;this.strpage=d||1;this.strpage=parseInt(this.strpage);this.strlimit=parseInt(this.strlimit);if(this.strpage<=0){this.strpage=1}if(this.strlimit<=0){this.strlimit=-1}if(c!=undefined){this.pagekeyorder=a}if(a!=undefined){this.pagekey=a}return this};__Model__.prototype.max=function(b){var a=b||this.pk;a=this.base.splitChars[0]+a+this.base.splitChars[1];if(this.base.cfg.DB_Type=="MSSQL"){return this.query("select isnull(max("+a+"),0) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value}else{if(this.base.cfg.DB_Type=="MYSQL"||this.base.cfg.DB_Type=="SQLITE"){return this.query("select IFNULL(max("+a+"),0) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value}}return this.query("select iif(isnull(max("+a+")),0,max("+a+")) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value};__Model__.prototype.min=function(b){var a=b||this.pk;a=this.base.splitChars[0]+a+this.base.splitChars[1];if(this.base.cfg.DB_Type=="MSSQL"){return this.query("select isnull(min("+a+"),0) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value}else{if(this.base.cfg.DB_Type=="MYSQL"||this.base.cfg.DB_Type=="SQLITE"){return this.query("select IFNULL(min("+a+"),0) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value}}return this.query("select iif(isnull(min("+a+")),0,min("+a+")) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value};__Model__.prototype.count=function(b){var a=b||this.pk;if(a!="*"){a=this.base.splitChars[0]+a+this.base.splitChars[1]}return this.query("select count("+a+") from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value};__Model__.prototype.sum=function(b){var a=b||this.pk;a=this.base.splitChars[0]+a+this.base.splitChars[1];if(this.base.cfg.DB_Type=="MSSQL"){return this.query("select isnull(sum("+a+"),0) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value}else{if(this.base.cfg.DB_Type=="MYSQL"||this.base.cfg.DB_Type=="SQLITE"){return this.query("select IFNULL(sum("+a+"),0) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value}}return this.query("select iif(isnull(sum("+a+")),0,sum("+a+")) from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""),true)(0).value};__Model__.prototype.increase=function(a,b){a=this.base.splitChars[0]+a+this.base.splitChars[1];b=b||1;b=parseInt(b);this.query("update "+this.table+" set "+a+" = "+a+" + ("+b+")"+(this.strwhere!=""?(" where "+this.strwhere):""));return this};__Model__.prototype.toogle=function(a,b){a=this.base.splitChars[0]+a+this.base.splitChars[1];b=b||1;b=parseInt(b);this.query("update "+this.table+" set "+a+" = "+b+" - "+a+" "+(this.strwhere!=""?(" where "+this.strwhere):""));return this};__Model__.prototype.join=function(b,a){a=a||"inner";a=a.replace(" join","");if(b.indexOf(" ")>0){this.strjoin+=" "+a+" join "+this.base.splitChars[0]+Mo.Config.Global.MO_TABLE_PERX+b.substr(0,b.indexOf(" "))+this.base.splitChars[1]+" "+b.substr(b.indexOf(" ")+1)}else{this.strjoin+=" "+a+" join "+this.base.splitChars[0]+Mo.Config.Global.MO_TABLE_PERX+b+this.base.splitChars[1]}this.joinlevel+="(";return this};__Model__.prototype.on=function(a){a=a||"";this.strjoin+=" on "+a+")";this.strjoin=F.string.trim(this.strjoin);return this};__Model__.prototype.cname=function(a){a=a||"";this.strcname=a;return this};__Model__.prototype.createCommandManager=function(b,a){return new _helper.CMDManager(b,this,a)};__Model__.prototype.exec=function(c){try{var a=F.timer.run()-0;if(Model__.allowDebug){PutDebug(c.cmd+",[#"+a+"]")}if(c.withQuery){this.rs__=c.exec();this.fetch();if(c.totalRecordsParm!=""){this.object_cache.recordcount=this.rc=(c.getparm(c.totalRecordsParm).value||0)}}else{c.exec()}if(Model__.allowDebug){PutDebug("query end.(time taken:"+F.timer.stop(a)+"MS),[#"+a+"]")}}catch(b){if(VBS&&VBS.ctrl.error.number!=0){ExceptionManager.put(VBS.ctrl.error.number,"__Model__.exec(manager)",VBS.ctrl.error.description);VBS.ctrl.error.clear()}else{ExceptionManager.put(b.number,"__Model__.exec(manager)",b.message)}}return this};__Model__.prototype.find=function(a){if(!isNaN(a)){return this.where(this.pk+" = "+a).select().read()}else{if(arguments.length>0){return __Model__.prototype.where.apply(this,arguments).select().read()}}return null};__Model__.prototype.select=function(c,a){if(F.exports.promise&&(a===true||c===true)){var b=new F.exports.promise();b.resolve(this.query().fetch());return b}if(typeof c=="function"){return this.query().fetch().each(c)}return this.query().fetch()};__Model__.prototype.query=function(){if(!this.base){return this}var a=0;this.sql="";this.countsql="";this.dispose();if(arguments.length>=1){try{if(arguments.length==2&&arguments[1]===true){a=F.timer.run()-0;if(Model__.allowDebug){PutDebug(arguments[0]+",[#"+a+"]")}var d=this.connection.execute(arguments[0]);if(Model__.allowDebug){PutDebug("query end(time taken:"+F.timer.stop(a)+"MS),[#"+a+"]")}return d}else{if(arguments.length==2&&(typeof arguments[1]=="string")){this.sql=arguments[0];this.countsql=arguments[1]}else{a=F.timer.run()-0;if(Model__.allowDebug){PutDebug(arguments[0]+",[#"+a+"]")}Model__.lastRows=Model__.RecordsAffected(this.connection,arguments[0]);if(Model__.allowDebug){PutDebug("query end(time taken:"+F.timer.stop(a)+"MS),[#"+a+"]")}return this}}}catch(b){if(VBS&&VBS.ctrl.error.number!=0){ExceptionManager.put(VBS.ctrl.error.number,"__Model__.query(args)",VBS.ctrl.error.description);VBS.ctrl.error.clear()}else{ExceptionManager.put(b.number,"__Model__.query(args)",b.message)}return this}}if(this.sql==""){_helper.Helper.GetSqls.call(this)}if(Mo.Config.Global.MO_MODEL_CACHE&&this.usecache){if(this.cachename==""){this.cachename=F.md5(this.sql)}if(Mo.ModelCacheExists(this.cachename)){var c=F.json(Mo.ModelCacheLoad(this.cachename));if(c!=null){this.object_cache=new DataTable();this.object_cache.fromState(c);return this}}}try{if(this.countsql!=""){a=F.timer.run()-0;if(Model__.allowDebug){PutDebug(this.countsql+",[#"+a+"]")}this.rc=this.connection.execute(this.countsql)(0).value;if(Model__.allowDebug){PutDebug("query end(time taken:"+F.timer.stop(a)+"MS),[#"+a+"]")}}a=F.timer.run()-0;if(Model__.allowDebug){PutDebug(this.sql+",[#"+a+"]")}this.rs__=new ActiveXObject("adodb.recordset");this.rs__.open(this.sql,this.connection,1,1);if(Model__.allowDebug){PutDebug("query end(time taken:"+F.timer.stop(a)+"MS),[#"+a+"]")}if(this.countsql==""){this.rc=this.rs__.recordcount}}catch(b){ExceptionManager.put(new Exception(b.number,"__Model__.query(args)",b.message))}return this};__Model__.prototype.fetch=function(){if(this.object_cache!=null){this.object_cache.reset();return this.object_cache}if(this.strlimit!=-1&&this.rc>0){this.rs__.pagesize=this.strlimit;if(this.pagekeyorder==""){this.rs__.absolutepage=this.strpage}}this.object_cache=new DataTable(this.rs__,this.strlimit);try{this.rs__.close()}catch(a){}this.rs__=null;this.object_cache.pagesize=this.strlimit;this.object_cache.recordcount=this.rc;this.object_cache.currentpage=this.strpage;if(Mo.Config.Global.MO_MODEL_CACHE&&this.usecache){if(!Mo.ModelCacheExists(this.cachename)){Mo.ModelCacheSave(this.cachename,this.object_cache.getState())}}return this.object_cache};__Model__.prototype.read=function(a){var b=this.fetch();if(!b.eof()){if(a===undefined){return b.read()}return b.read()[a]}if(a===undefined){return{}}return""};__Model__.prototype.getjson=function(a){return this.fetch().getjson(a)};__Model__.prototype.assign=function(a,d){if(d!==true){d=false}if(a&&!d){Mo.assign(a,this.fetch())}else{var e=this.fetch();if(!e.eof()){var c=e.read();if(d){Mo.assign(a,c)}else{for(var b in c){if(!c.hasOwnProperty(b)){continue}Mo.assign(b,c[b])}}}}return this};__Model__.prototype.Insert=__Model__.prototype.insert=function(){var b=null;if(arguments.length==1){if((typeof arguments[0]=="object")){if(arguments[0].constructor==DataTableRow){b=arguments[0]}else{b=(new DataTableRow()).fromObject(arguments[0],this.pk)}}}if(arguments.length>0&&arguments.length%2==0){b=DataTableRow.apply(null,arguments)}if(b==null){b=(new DataTableRow()).fromPost(this.pk)}var a=this.parseData(b.table);if(a[0]!=""&&a[1]!=""){if(a[3]!=null){a[3].withQuery=false;a[3].cmd="insert into "+this.table+"("+a[0]+") values("+a[1]+")";this.exec(a[3]);Model__.lastRows=a[3].affectedRows}else{this.query("insert into "+this.table+"("+a[0]+") values("+a[1]+")")}}return this};__Model__.prototype.Update=__Model__.prototype.update=function(){var b=null;if(arguments.length==1){if((typeof arguments[0]=="object")){if(arguments[0].constructor==DataTableRow){b=arguments[0]}else{b=(new DataTableRow()).fromObject(arguments[0],this.pk)}}else{if((typeof arguments[0]=="string")&&arguments[0]!=""){this.query("update "+this.table+" set "+arguments[0]+(this.strwhere!=""?(" where "+this.strwhere):""));return this}}}if(arguments.length>0&&arguments.length%2==0){b=DataTableRow.apply(null,arguments)}if(b==null){b=(new DataTableRow()).fromPost(this.pk);if(this.strwhere==""&&b.pk!=""){this.strwhere=this.base.splitChars[0]+this.pk+this.base.splitChars[1]+" = "+b.pk}}var a=this.parseData(b.table);if(a[2]!=""){if(a[3]!=null){a[3].withQuery=false;a[3].cmd="update "+this.table+" set "+a[2]+(this.strwhere!=""?(" where "+this.strwhere):"");this.exec(a[3]);Model__.lastRows=a[3].affectedRows}else{this.query("update "+this.table+" set "+a[2]+(this.strwhere!=""?(" where "+this.strwhere):""))}}return this};__Model__.prototype.del=__Model__.prototype.Delete=function(a){a=a===true;if(this.strwhere==""&&!a){return this}this.query("delete from "+this.table+(this.strwhere!=""?(" where "+this.strwhere):""));return this};__Model__.prototype.dispose=function(){if(this.rs__!=null){try{this.rs__.close()}catch(a){}this.rs__=null}if(this.object_cache!=null){this.object_cache.dispose();this.object_cache=null}return this};__Model__.prototype.parseData=function(l){var g=[],k=[],c=[],b=null,f=((this.fields==""||this.fields=="*")?"":(","+this.fields+","));var a=null;if(this.base.useCommand&&this.base.cfg.DB_Schema&&this.base.cfg.DB_Schema[this.tableWithNoSplitChar]){a=this.createCommandManager("",_helper.Helper.Enums.CommandType.TEXT);b=this.base.cfg.DB_Schema[this.tableWithNoSplitChar]}for(var d in l){if(!l.hasOwnProperty(d)){continue}if(l[d]["value"]===undefined){continue}if(f!=""&&f.indexOf(","+d+",")<0){continue}g.push(this.base.splitChars[0]+d+this.base.splitChars[1]);var j=l[d]["value"];if(a!=null){k.push("?");c.push(this.base.splitChars[0]+d+this.base.splitChars[1]+"=?");var e=a.addParm("@"+d,j);var h=b[d];e.Type=h.DATA_TYPE;if(h.NUMERIC_PRECISION!=null){e.Precision=h.NUMERIC_PRECISION}if(h.CHARACTER_MAXIMUM_LENGTH!=null){e.Size=h.CHARACTER_MAXIMUM_LENGTH}if(h.NUMERIC_SCALE!=null){e.Scale=h.NUMERIC_SCALE}}else{if(l[d]["type"]!="exp"&&(typeof l[d]["value"]=="string")){j=("'"+l[d]["value"].replace(/\'/igm,"''")+"'").replace(/\0/ig,"")}if(j===null){j="null"}k.push(j);c.push(this.base.splitChars[0]+d+this.base.splitChars[1]+"="+j)}}return[g.join(","),k.join(","),c.join(","),a]};exports.Model__=Model__;exports.__Model__=__Model__;