import React, { Component } from 'react'

import './App.css'

interface IAppState {
	currentImageIndex: number
	images: string[]
	movementFromStart: number
}

class App extends Component<{}, IAppState> {
	private readonly imageHeight = 200
	private readonly imageWidth = 300

	constructor(props: any) {
		super(props)
		this.state = {
			currentImageIndex: 0,
			images: [
				'//thispersondoesnotexist.com',
				'//picsum.photos/200/300?image=0',
				'//picsum.photos/200/300?image=1',
				'//picsum.photos/200/300?image=2',
				'//picsum.photos/200/300?image=3'
			],
			movementFromStart: 0
		}
	}

	componentDidMount() {
		window.document.title = 'RIV: React Image Viewer'
	}

	render() {
		const { images, movementFromStart } = this.state

		return (
			<div className="App">
				<h1>RIV: React Image Viewer</h1>
				<p>Number of images: {images.length}</p>
				<article className="main"
					onWheel={this.handleWheel}
					style={{ height: `${this.imageHeight}px`, width: `${this.imageWidth}px` }}>
					<section className="image-swiper" style={{ transform: `translateX(${movementFromStart * -1}px)` }}>
						{images.map((src: string) =>
							<img key={src} src={src} height="100%" width="100%" />)}
					</section>
				</article>
			</div>
		)
	}

	private handleWheel = (evt: React.WheelEvent<HTMLElement>) => this.scrollTheViewer(evt.deltaX)

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
}

export default App
