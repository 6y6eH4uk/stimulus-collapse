/*
	Событие stimulus-collapse-toggle:
    
    {
    	detail: {
        	status: true
        }
    }
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
        
        this.element.dispatchEvent(new CustomEvent('stimulus-collapse-toggle', {
        	detail: {
            	status: status
            }
        }))
        
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

let application;

if (window.stimulusApplication) {
    application = window.stimulusApplication
} else {
    application = Stimulus.Application.start()
}

application.register('collapse', CollapseController)

window.stimulusApplication = application
