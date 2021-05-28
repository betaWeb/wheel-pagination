export default class WheelPaginationService {

	/**
	 * @returns {object<string, *>}
	 */
	static get DEFAULT_OPTIONS() {
		return {
			total_rows: 0,
			per_page: 10,
			onPaginated: () => {}
		};
	}

	/**
		* @param {Element|Element[]|Window} [nodes=window]
		* @param {object} [options={}]
		* @param {number} options.total_rows
		* @param {number} options.per_page
		* @param {Function} options.onPaginated
		*/
	constructor(nodes = window, options = {}) {
		this.nodes = Array.isArray(nodes) ? nodes : [nodes];
		this.options = {
			...WheelPaginationService.DEFAULT_OPTIONS,
			...options
		};
		this.current_page = 1;

		this._onMouseWheel = this._onMouseWheel.bind(this);
	}

	get nbPages() {
		return Math.ceil(this.options.total_rows / this.options.per_page);
	}

	/**
		* @param {number} value
		* @returns {void}
		*/
	set per_page(value) {
		this.options.per_page = value;
	}

	/**
		* @param {number} value
		* @returns {void}
		*/
	set total_rows(value) {
		this.options.total_rows = value;
	}

	/**
		* @returns {number}
		*/
	offset() {
		return this.options.per_page * (this.current_page - 1);
	}

	/**
		* @returns {void}
		*/
	paginate() {
		this.nodes.forEach(node => {
			node.addEventListener('wheel', this._onMouseWheel);
		});
	}

	reset() {
		this.current_page = 1;
	}

	/**
		* @returns {void}
		*/
	destroy() {
		this.nodes.forEach(node => {
			node.removeEventListener('wheel', this._onMouseWheel);
		});
	}

	/**
		* @param {WheelEvent} e
		* @returns {void}
		*/
	_onMouseWheel(e) {
		if (e.deltaY < 0) {
			this.current_page--;

			if (this.current_page === 0) {
				this.current_page = 1;

				return;
			}
		} else if (e.deltaY > 0) {
			this.current_page++;

			if (this.current_page > this.nbPages) {
				this.current_page = this.nbPages;

				return;
			}
		}

		this.options.onPaginated(e);
	}

}
