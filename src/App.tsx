import React, { Component } from 'react'

import './App.css'

interface IAppState {
	currentImageIndex: number
	images: string[]
	movementFromStart: number
	transitionDuration: string
}

class App extends Component<{}, IAppState> {
	private readonly imageHeight = 200
	private readonly imageWidth = 300

	private lastTouch = 0
	private transitionTimeout: any//NodeJS.Timeout = new NodeJS.Timeout()
	private wheelTimeout: any//NodeJS.Timeout = new NodeJS.Timeout()

	constructor(props: any) {
		super(props)
		this.state = {
			currentImageIndex: 0,
			images: [
				// '//thispersondoesnotexist.com',
				'//picsum.photos/200/300?image=0',
				'//picsum.photos/200/300?image=1',
				'//picsum.photos/200/300?image=2',
				'//picsum.photos/200/300?image=3'
			],
			movementFromStart: 0,
			transitionDuration: '0s'
		}
	}

	componentDidMount() {
		window.document.title = 'RIV: React Image Viewer'
	}

	componentWillUnmount() {
		clearTimeout(this.transitionTimeout)
	}

	render() {
		const { currentImageIndex, images, movementFromStart, transitionDuration } = this.state
		const maxLength = images.length - 1
		const maxMovement = maxLength * this.imageWidth
	
		return (
			<div className="App">
				{/*
				<h1>RIV: React Image Viewer</h1>
				<p>Number of images: {images.length}</p>
				*/}
				<div className="main" style={{
						height: `${this.imageHeight}px`,
						width: `${this.imageWidth}px`
					}}
					onTouchEnd={this.handleTouchEnd}
					onTouchMove={this.handleTouchMove}
					onTouchStart={this.handleTouchStart}
					onWheel={this.handleWheel}>
					<div className="swiper" style={{
						transform: `translateX(${movementFromStart * -1}px)`,
						transitionDuration
					}}>
						{images.map(src => <img key={src} src={src} width="100%" height="100%" />)}
					</div>
					{movementFromStart !== 0 && <button className="back move"
						onClick={() => { this.transitionTo(currentImageIndex - 1, 0.5) }}>←</button>}
					{movementFromStart !== maxMovement && <button className="next move"
						onClick={() => { this.transitionTo(currentImageIndex + 1, 0.5) }}>→</button>}
				</div>
			</div>
		)
	}

	private handleMovement = (delta: number) => {
		clearTimeout(this.transitionTimeout)
	
		this.setState((prevState: IAppState) => {
			const maxLength = prevState.images.length - 1
	
			let nextMovement = prevState.movementFromStart + delta
	
			if (nextMovement < 0) {
				nextMovement = 0
			}
	
			if (nextMovement > maxLength * this.imageWidth) {
				nextMovement = maxLength * this.imageWidth
			}
	
			return {
				movementFromStart: nextMovement,
				transitionDuration: '0s'
			}
		})
	}
	
	private handleMovementEnd = () => {
		const { movementFromStart, currentImageIndex } = this.state
	
		const endPosition = movementFromStart / this.imageWidth
		const endPartial = endPosition % 1
		const endingIndex = endPosition - endPartial
		const deltaInteger = endingIndex - currentImageIndex
	
		let nextIndex = endingIndex
	
		if (deltaInteger >= 0) {
			if (endPartial >= 0.1) {
				nextIndex += 1
			}
		} else if (deltaInteger < 0) {
			nextIndex = currentImageIndex - Math.abs(deltaInteger)
			if (endPartial > 0.9) {
				nextIndex += 1
			}
		}
	
		this.transitionTo(nextIndex, Math.min(0.5, 1 - Math.abs(endPartial)))
	}

	private handleTouchEnd = () => {
		this.handleMovementEnd()
		this.lastTouch = 0
	}

	private handleTouchMove = (e: React.TouchEvent) => {
		const delta = this.lastTouch - e.nativeEvent.touches[0].clientX
		this.lastTouch = e.nativeEvent.touches[0].clientX
	
		this.handleMovement(delta)
	}

	private handleTouchStart = (e: React.TouchEvent) => {
		this.lastTouch = e.nativeEvent.touches[0].clientX
	}

	private handleWheel = (evt: React.WheelEvent<HTMLElement>) => {
		clearTimeout(this.wheelTimeout)
		this.scrollTheViewer(evt.deltaX)
		this.wheelTimeout = setTimeout(() => this.handleMovementEnd(), 100)
	}

	private scrollTheViewer = (deltaHorizontal: number) => {
		this.setState(state => {
			const lastPossibleIndex = state.images.length - 1
			const maximumXScroll = lastPossibleIndex * this.imageWidth
			const minimumXScroll = 0
			let updatedXScroll = state.movementFromStart + deltaHorizontal

			if (updatedXScroll < minimumXScroll) {
				updatedXScroll = minimumXScroll
			}

			if (updatedXScroll > maximumXScroll) {
				updatedXScroll = maximumXScroll
			}

			return { movementFromStart: updatedXScroll }
		})
	}

	private transitionTo = (currentImageIndex: number, duration: number) => {
		this.setState({
			currentImageIndex,
			movementFromStart: currentImageIndex * this.imageWidth,
			transitionDuration: `${duration}s`,
		})
	
		this.transitionTimeout = setTimeout(() => {
			this.setState({ transitionDuration: '0s' })
		}, duration * 100)
	}
}

export default App
