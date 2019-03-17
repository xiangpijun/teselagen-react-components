import React from "react";
import {
  pickBy,
  isNumber,
  startsWith,
  flatMap,
  isArray,
  take,
  set,
  isString
} from "lodash";
import { Suggest } from "@blueprintjs/select";
import Fuse from "fuse.js";
import "./style.css";
import {
  Popover,
  Position,
  Menu,
  Button,
  Hotkeys,
  HotkeysTarget,
  Hotkey
} from "@blueprintjs/core";
import { createDynamicMenu, DynamicMenuItem } from "../utils/menuUtils";
import { comboToLabel } from "../utils/hotkeyUtils";

@HotkeysTarget
export default class MenuBar extends React.Component {
  static defaultProps = {
    className: "",
    style: {}
  };

  state = { searchVal: "", isOpen: false, openIndex: null };

  handleInteraction = index => newOpenState => {
    if (!newOpenState && index !== this.state.openIndex) {
      return; //return early because the "close" is being fired by another popover
    }
    this.setState({
      isOpen: newOpenState,
      openIndex: newOpenState ? index : null
    });
  };
  handleMouseOver = index => () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({
        openIndex: index
      });
    }
  };

  get allMenuItems() {
    const { menu, enhancers, context } = this.props;
    return getAllMenuTextsAndHandlers(menu, enhancers, context);
  }
  addHelpItemIfNecessary = (menu, i) => {
    return menu.map((item, innerIndex) => {
      if (item.isMenuSearch) {
        const isTopLevelSearch = !isNumber(i);
        this.isTopLevelSearch = isTopLevelSearch;
        this.menuSearchIndex = isTopLevelSearch ? innerIndex : i;
        return {
          shouldDismissPopover: false,
          text: (
            <div>
              <Suggest
                closeOnSelect={false}
                items={this.allMenuItems}
                itemListPredicate={filterMenuItems}
                itemDisabled={i => i.disabled}
                popoverProps={{
                  minimal: true,
                  popoverClassName: "tg-menu-search-suggestions"
                }}
                resetOnSelect={false}
                resetOnClose={false}
                inputProps={{
                  inputRef: n => {
                    if (n) {
                      this.searchInput = n;
                    }
                  },
                  // small: isTopLevelSearch,
                  autoFocus: !isTopLevelSearch,
                  placeholder: `Search... (${comboToLabel(
                    this.props.menuSearchHotkey || menuSearchHotkey,
                    false
                    // isTopLevelSearch
                  )})`
                }}
                initialContent={null}
                onItemSelect={this.handleItemClickOrSelect()}
                inputValueRenderer={i => i.text}
                noResults={<div>No Results...</div>}
                itemRenderer={this.itemRenderer}
              />
            </div>
          )
        };
      } else {
        return item;
      }
    });
  };

  itemRenderer = (i, b) => {
    // if (i.submenu.length === 3) debugger;
    return (
      <DynamicMenuItem
        key={b.index}
        {...{
          doNotEnhanceTopLevelItem: true,
          enhancers: this.props.enhancers,
          def: {
            submenu: i.submenu,
            icon: i.icon,
            text: i.isSimpleText ? i.justText || i.text : i.text,
            label: i.path.length && (
              <span style={{ fontSize: 8 }}>
                {flatMap(i.path, (el, i2) => {
                  if (i2 === 0) return el;
                  return [" > ", el];
                })}
              </span>
            ),
            onClick: this.handleItemClickOrSelect(i),
            active: b.modifiers.active
            // shouldDismissPopover: true,
          }
        }}
      />
    );
  };
  // itemRenderer = (i, b) => {
  //   return (
  //     <MenuItem
  //       key={b.index}
  //       {...{
  //         // ...i,
  //         icon: i.icon,
  //         text: i.isSimpleText ? i.justText || i.text : i.text,
  //         label: i.path.length && (
  //           <span style={{ fontSize: 8 }}>
  //             {flatMap(i.path, (el, i2) => {
  //               if (i2 === 0) return el;
  //               return [" > ", el];
  //             })}
  //           </span>
  //         ),
  //         onClick: this.handleItemClickOrSelect(i),
  //         active: b.modifiers.active
  //         // shouldDismissPopover: true,
  //       }}
  //     />
  //   );
  // };

  handleItemClickOrSelect = __i => _i => {
    const i = __i || _i;
    if (!i.onClick) return;
    !i.disabled && i.onClick();
    if (i.shouldDismissPopover !== false) {
      this.setState({ isOpen: false });
    } else {
      if (_i && _i.stopPropagation) {
        _i.stopPropagation();
        _i.preventDefault();
      }
    }
  };
  renderHotkeys() {
    if (!isNumber(this.menuSearchIndex)) return null;
    return (
      <Hotkeys>
        <Hotkey
          global={true}
          combo={this.props.menuSearchHotkey || menuSearchHotkey}
          label="Search the menu"
          preventDefault
          stopPropagation
          onKeyDown={this.focusSearchMenu}
        />
      </Hotkeys>
    );
  }
  focusSearchMenu = () => {
    if (this.isTopLevelSearch) {
      this.searchInput && this.searchInput.focus();
    } else {
      this.setState({
        isOpen: true,
        openIndex: this.menuSearchIndex
      });
    }
  };

  render() {
    const { className, style, menu, enhancers, extraContent } = this.props;
    const { isOpen, openIndex } = this.state;

    return (
      <div className={"tg-menu-bar " + className} style={style}>
        {this.addHelpItemIfNecessary(menu).map((topLevelItem, i) => {
          const dataKeys = pickBy(topLevelItem, function(value, key) {
            return startsWith(key, "data-");
          });

          // Support enhancers for top level items too
          topLevelItem = enhancers.reduce((v, f) => f(v), topLevelItem);

          if (topLevelItem.hidden) {
            return null;
          }

          const button = (
            <Button
              {...dataKeys} //spread all data-* attributes
              key={i}
              minimal
              className="tg-menu-bar-item"
              onClick={topLevelItem.onClick}
              disabled={topLevelItem.disabled}
              onMouseOver={
                topLevelItem.submenu ? this.handleMouseOver(i) : noop
              }
            >
              {topLevelItem.text}
            </Button>
          );
          return !topLevelItem.submenu ? (
            button
          ) : (
            <Popover
              autoFocus={false}
              key={i}
              minimal
              portalClassName="tg-menu-bar-popover"
              position={Position.BOTTOM_LEFT}
              isOpen={isOpen && i === openIndex}
              onInteraction={this.handleInteraction(i)}
              content={
                <Menu>
                  {createDynamicMenu(
                    this.addHelpItemIfNecessary(topLevelItem.submenu, i),
                    enhancers
                  )}
                </Menu>
              }
              transitionDuration={0}
              style={{
                transition: "none"
              }}
              inline
            >
              {button}
            </Popover>
          );
        })}
        {extraContent}
      </div>
    );
  }
}

function noop() {}

function getAllMenuTextsAndHandlers(menu, enhancers, context, path = []) {
  if (!menu) return [];
  return flatMap(menu, item => {
    const enhancedItem = [...enhancers].reduce((v, f) => f(v, context), item);
    if (isDivider(enhancedItem)) {
      return [];
    }
    return [
      {
        ...enhancedItem,
        path
      },
      ...getAllMenuTextsAndHandlers(enhancedItem.submenu, enhancers, context, [
        ...path,
        enhancedItem.text
      ])
    ];
  });
}

const isDivider = item => item.divider !== undefined;

const options = {
  shouldSort: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.7,
  location: 0,
  distance: 500,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["justText"]
};

const filterMenuItems = (searchVal, items) => {
  const newItems = flatMap(items, item => {
    const { text, onClick, hideFromMenuSearch, showInSearchMenu } = item;
    if (
      !showInSearchMenu &&
      (!text || !onClick || !searchVal || hideFromMenuSearch)
    )
      return [];
    //fix this to use some smart regex
    let justText = text;
    let isSimpleText = true;
    if (!text.toLowerCase) {
      if (text.props) {
        isSimpleText = false;
        justText = getStringFromReactComponent(text);
      } else {
        return [];
      }
    }
    return { ...item, justText, isSimpleText };
    // return _text.toLowerCase().indexOf(searchVal.toLowerCase()) > -1;
  });
  const fuse = new Fuse(newItems, options); // "list" is the item array
  const result = highlight(fuse.search(searchVal));
  return take(result, 10);
};

function getStringFromReactComponent(comp) {
  if (!comp) return "";
  if (isString(comp) || isNumber(comp)) return comp;
  const { children } = comp.props || {};
  if (!children) return "";
  if (isArray(children))
    return flatMap(children, getStringFromReactComponent).join("");
  if (isString(children)) return children;

  if (children.props) {
    return getStringFromReactComponent(children.props);
  }
}

const menuSearchHotkey = "meta+/";

const highlight = (
  fuseSearchResult: any,
  highlightClassName: string = "tg_search_highlight"
) => {
  const generateHighlightedText = (
    inputText: string,
    regions: number[] = []
  ) => {
    let content = [];
    let nextUnhighlightedRegionStartingIndex = 0;

    regions.forEach(region => {
      const lastRegionNextIndex = region[1] + 1;

      content = [
        ...content,
        inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
        <span key={lastRegionNextIndex} className={highlightClassName}>
          {inputText.substring(region[0], lastRegionNextIndex)}
        </span>
      ];

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
    });

    content = [
      ...content,
      inputText.substring(nextUnhighlightedRegionStartingIndex)
    ];

    return content;
  };

  return fuseSearchResult
    .filter(({ matches }: any) => matches && matches.length)
    .map(({ item, matches }: any) => {
      const highlightedItem = { ...item };

      matches.forEach((match: any) => {
        set(
          highlightedItem,
          match.key,
          generateHighlightedText(match.value, match.indices)
        );
      });

      return highlightedItem;
    });
};
