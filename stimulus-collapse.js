/*
	Основное событие: stimulus-collapse-toggle
    
    {
    	detail: {
        	status: true
        }
    }
    
    Побочные события: stimulus-collapse-status-true, stimulus-collapse-status-false
*/
class CollapseController extends Stimulus.Controller {
	static targets = ['content', 'wrapper']
    
    static values = {
    	status: Boolean,
        transition: Number
    }

	initialize() {
        if (!document.querySelector('#collapse-style')) {
        	document.querySelector('head').insertAdjacentHTML('beforeend', `
                <style id="collapse-style">
                    .collapse {
                        display: none;
                    }

                    .collapse.show {
                        display: block;
                    }

                    .collapsing {
                        position: relative;
                        height: 0;
                        overflow: hidden;
                        transition: height ${this.hasTransitionValue ? this.transitionValue : '0.35'}s ease;
                    }
                </style>
            `)
        }
    }
    
    connect() {
    	if (this.statusValue) {
       		this.wrapperTarget.classList.add('collapse', 'show')
        } else {
        	this.wrapperTarget.classList.add('collapse')
        }
    }
    
    actualStatus() {
    	return this.wrapperTarget.classList.contains('collapse') && this.wrapperTarget.classList.contains('show')
    }
    
    statusValueChanged() {
    	if (this.waitTransition) {
        	return
        }

        if (this.statusValue === this.actualStatus()) {
        	return
        }
        
    	this.waitTransition = true
        const status = this.statusValue
        this.dispatchEvent(status)
        
        if (!status) {
        	this.wrapperTarget.style.height = this.contentTarget.scrollHeight+'px'
        }
        
        this.wrapperTarget.classList.add('collapsing')
        this.wrapperTarget.classList.remove('collapse', 'show')
        
        if (status) {
            this.wrapperTarget.style.height = this.contentTarget.scrollHeight+'px'
        } else {
            setTimeout(() => {this.wrapperTarget.style.height = ''})
        }
        
    	setTimeout(() => {
        	this.wrapperTarget.classList.remove('collapsing')
            this.wrapperTarget.classList.add('collapse')
            this.wrapperTarget.style.height = ''
            
            if (status) {
            	this.wrapperTarget.classList.add('show')
            }
            
        	this.waitTransition = false
        
            setTimeout(() => {this.statusValueChanged()}, 100)
        }, (this.hasTransitionValue ? this.transitionValue : 0.35)*1000)
    }
    
    dispatchEvent(status) {
        this.element.dispatchEvent(new CustomEvent('stimulus-collapse-toggle', {
        	detail: {
            	status: status
            }
        }))
        
        if (status) {
            this.element.dispatchEvent(new CustomEvent('stimulus-collapse-status-true'))
        } else {
            this.element.dispatchEvent(new CustomEvent('stimulus-collapse-status-false'))        
        }
    }
    
    toggle() {
    	this.statusValue = !this.statusValue
    }
    
    on() {
    	this.statusValue = true
    }
    
    off() {
    	this.statusValue = false
    }
}

(function() {
    let application

    if (window.stimulusApplication) {
        application = window.stimulusApplication
    } else {
        application = Stimulus.Application.start()
    }

    application.register('collapse', CollapseController)

    window.stimulusApplication = application
})()
