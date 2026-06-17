$(function() {
    var scormApi,
        scormType,
        scormRequest,
        scormData,
        pendingRequest = false,
        requestTimeout
    ;
    
    const sendRequest = function () {
        if (scormRequest) {
            pendingRequest = true;
        } else {
            if (requestTimeout) {
                return;
            }
            pendingRequest = false;
            scormRequest = api.post('/lesson/' + lessonId + '/scorm_data', { type: scormType, data: scormData }, function () {
                scormRequest = null;
                if (pendingRequest) {
                    sendRequest();
                }
            });
            requestTimeout = setTimeout(function () {
                requestTimeout = null;
                if (pendingRequest) {
                    sendRequest();
                }
            }, 1000);
        }
    }
    
    var handleCommit = function () {        
        /* -> MOT-23386. Костыль для проверки законченности скорма. Бэк определяет законченность по параметру completion_status = 'completed'. Значение параметра взято из кода скорма, из файла res/lms.js */
        if (scormApi.cmi.progress_measure == 1) {
            scormApi.cmi.completion_status = 'completed';
        }
        /* <- костыль */
        
        const data = JSON.stringify(scormApi.cmi.toJSON());
        if (scormData !== data) {
            scormData = data;
            sendRequest();    
        }
    };
    
    var initialize = function() {
        window.API.reset();
        window.API_1484_11.reset();
        window.API.apiLogLevel = 1;
        window.API_1484_11.apiLogLevel = 1;
        
        //v 1.2
        window.API.on("LMSInitialize", function() {
            scormApi = window.API;
            scormType = '1.2';
        });
        
        window.API.on("LMSCommit", function() {
            handleCommit();
        });
        
        window.API.on("LMSFinish", function() {
            handleCommit();
            initialize();
        });
        
        window.API.on("LMSSetValue.cmi.core.exit", function(CMIElement, value) {
            handleCommit();
        });
        
        window.API.on("LMSSetValue.cmi.core.lesson_location", function(CMIElement, value) {
            handleCommit();
        });
        
        window.API.on("LMSSetValue.cmi.core.lesson_status", function(CMIElement, value) {
            handleCommit();
        });
        
        //v 2004     
        window.API_1484_11.on("Initialize", function() {
            scormApi = window.API_1484_11;
            scormType = '2004';
        });

        window.API_1484_11.on("Commit", function() {
            handleCommit();
        });      

        window.API_1484_11.on("Terminate", function() {
            handleCommit();
            initialize();
        });

        window.API_1484_11.on("SetValue.cmi.exit", function(CMIElement, value) {
            handleCommit();
        });     

        window.API_1484_11.on("SetValue.cmi.location", function(CMIElement, value) {
            handleCommit();
        });

        window.API_1484_11.on("SetValue.cmi.completion_status", function(CMIElement, value) {
            handleCommit();
        });

        window.API_1484_11.on("SetValue.cmi.success_status", function(CMIElement, value) {
            handleCommit();
        });        
    };
    
    initialize();

    if (type && studentId && studentName) {
        if (type == '1.2') {
            window.API.cmi.core.student_id = studentId;
            window.API.cmi.core.student_name  = studentName;
        }

        if (type == '2004') {
            window.API_1484_11.cmi.learner_id = studentId;
            window.API_1484_11.cmi.learner_name  = studentName;
        }
    }

    api.get('/lesson/' + lessonId + '/scorm_data', function(response) {
        if(response.type)
        {
            switch(response.type)
            {
                case '1.2':
                    window.API.loadFromJSON(response.data);
                    if(!window.API.isInitialized())
                    {
                        window.API.cmi.core.student_id = response.student_id;
                        window.API.cmi.core.student_name  = response.student_name;
                    }                            
                    break;
                case '2004':
                    window.API_1484_11.loadFromJSON(response.data);
                    if(!window.API_1484_11.isInitialized())
                    {
                        window.API_1484_11.cmi.learner_id = response.student_id;
                        window.API_1484_11.cmi.learner_name  = response.student_name;
                    }
                    break;
            }
        }
        
        $('iframe').each(function() {
            $(this).attr('src', $(this).data('resource'))
        });
    });
});