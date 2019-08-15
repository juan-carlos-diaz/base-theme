/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
// Disabled due placeholder needs

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ProductType } from 'Type/ProductList';
import Field from 'Component/Field';
import ProductConfigurableAttributes from 'Component/ProductConfigurableAttributes';
import TextPlaceholder from 'Component/TextPlaceholder';
import ProductPrice from 'Component/ProductPrice';
import AddToCart from 'Component/AddToCart';
import Html from 'Component/Html';
import './ProductActions.style';

/**
 * Product actions
 * @class ProductActions
 */
class ProductActions extends PureComponent {
    constructor(props) {
        super(props);

        this.optionsInCurrentVariant = {};
        this.setQuantityToDefault = this.setQuantityToDefault.bind(this);
        this.state = {
            quantity: 1
        };
    }

    // TODO: make key=>value based
    getIsOptionInCurrentVariant(attribute, value) {
        const { configurableVariantIndex, product: { variants } } = this.props;
        if (!variants) return false;
        return variants[configurableVariantIndex].product[attribute] === value;
    }

    setQuantityToDefault() {
        this.setState({ quantity: 1 });
    }

    showOnlyIfLoaded(expression, content, placeholder = content) {
        const { areDetailsLoaded } = this.props;

        if (!areDetailsLoaded) return placeholder;
        if (areDetailsLoaded && !expression) return null;
        return content;
    }

    renderSkuAndStock() {
        const { product: { sku } } = this.props;

        return (
            <section
              block="ProductActions"
              elem="Section"
              mods={ { type: 'sku' } }
              aria-label="Product SKU and availability"
            >
                { this.showOnlyIfLoaded(
                    sku,
                    (
                    <>
                        <span block="ProductActions" elem="Sku">{ `SKU: ${ sku }` }</span>
                        <span block="ProductActions" elem="Stock">In Stock</span>
                    </>),
                    <TextPlaceholder />
                ) }
            </section>
        );
    }

    renderConfigurableAttributes() {
        const {
            getLink,
            updateUrl,
            parameters,
            areDetailsLoaded,
            product: { configurable_options, type_id }
        } = this.props;

        if (type_id !== 'configurable') return null;

        return (
            <ProductConfigurableAttributes
              mix={ { block: 'ProductActions', elem: 'Attributes' } }
              isReady={ areDetailsLoaded }
              getLink={ getLink }
              parameters={ parameters }
              updateConfigurableVariant={ updateUrl }
              configurable_options={ configurable_options }
            />
        );
    }

    renderShortDescription() {
        const { product: { short_description, brand } } = this.props;
        const { html } = short_description || {};

        return (
            <section
              block="ProductActions"
              elem="Section"
              mods={ { type: 'short' } }
              aria-label="Product short description"
            >
                { this.showOnlyIfLoaded(
                    brand,
                    (
                        <h4
                          block="ProductActions"
                          elem="SectionHeading"
                          mods={ { type: 'brand' } }
                        >
                            <TextPlaceholder content={ brand } />
                        </h4>
                    )
                ) }
                <div block="ProductActions" elem="ShortDescription">
                    { html ? <Html content={ html } /> : <TextPlaceholder length="long" /> }
                </div>
            </section>
        );
    }

    renderNameAndBrand() {
        const {
            product:
            {
                name,
                attributes: { brand: { attribute_value: brand } = {} } = {}
            }
        } = this.props;

        return (
            <section
              block="ProductActions"
              elem="Section"
              mods={ { type: 'name' } }
            >
                { this.showOnlyIfLoaded(
                    brand,
                    (
                        <h4 block="ProductActions" elem="Brand">
                            <TextPlaceholder content={ brand } />
                        </h4>
                    )
                ) }
                <p block="ProductActions" elem="Title">
                    <TextPlaceholder content={ name } length="medium" />
                </p>
            </section>
        );
    }

    renderQuantityInput() {
        const { quantity } = this.state;

        return (
            <Field
              id="item_qty"
              name="item_qty"
              type="number"
              min={ 1 }
              value={ quantity }
              mix={ { block: 'ProductActions', elem: 'Qty' } }
              onChange={ value => this.setState({ quantity: value }) }
            />
        );
    }

    renderAddToCart() {
        const { configurableVariantIndex, product } = this.props;
        const { quantity } = this.state;

        return (
            <AddToCart
              product={ product }
              configurableVariantIndex={ configurableVariantIndex }
              mix={ { block: 'ProductActions', elem: 'AddToCart' } }
              quantity={ quantity }
            />
        );
    }

    renderPrice() {
        const { product: { price } } = this.props;

        return (
            <ProductPrice
              price={ price }
              mix={ { block: 'ProductActions', elem: 'Price' } }
            />
        );
    }

    render() {
        return (
            <article block="ProductActions">
                { this.renderPrice() }
                <div block="ProductActions" elem="AddToCartWrapper">
                  { this.renderAddToCart() }
                  { this.renderQuantityInput() }
                </div>
                { this.renderNameAndBrand() }
                { this.renderSkuAndStock() }
                { this.renderConfigurableAttributes() }
                { this.renderShortDescription() }
            </article>
        );
    }
}

ProductActions.propTypes = {
    product: ProductType.isRequired,
    configurableVariantIndex: PropTypes.number,
    // updateConfigurableVariantIndex: PropTypes.func.isRequired,
    areDetailsLoaded: PropTypes.bool.isRequired
};

ProductActions.defaultProps = {
    configurableVariantIndex: 0
};

export default ProductActions;
