class SliderController extends Stimulus.Controller {
    static targets = ['slider', 'dot']

    static values = {
        slidesToShow: Number,
        slidesToScroll: Number,
        fade: Boolean,
        index: Number
    }

    static classes = ['activeDot']

    connect() {
        $(this.sliderTarget).slick({
            slidesToShow: this.slidesToShowValue,
            slidesToScroll: this.slidesToScrollValue,
            arrows: false,
            fade: this.fadeValue
        })

        $(this.sliderTarget).on('beforeChange', (event, slick, currentSlide, nextSlide) => {
            this.indexValue = nextSlide
        })
    }

    indexValueChanged() {
        if (this.hasActiveDotClass && this.hasDotTarget) {
            this.dotTargets.forEach(el => {
                if (el.dataset.slideIndex == this.indexValue) {
                    el.classList.add(...this.activeDotClass.split(' '))
                } else {
                    this.activeDotClass.split(' ').forEach(className => {
                        el.classList.remove(className)
                    })
                }
            })
        }
    }

    prev() {
        $(this.sliderTarget).slick('slickPrev')
    }

    next() {
        $(this.sliderTarget).slick('slickNext')
    }

    goTo({ currentTarget }) {
        $(this.sliderTarget).slick('slickGoTo', currentTarget.dataset.slideIndex ?? 0)
    }
}

let application;

if (window.stimulusApplication) {
    application = window.stimulusApplication
} else {
    application = Stimulus.Application.start()
}

application.register('slider', SliderController)

window.stimulusApplication = application
