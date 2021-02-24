/**
     * Execute Shortcut w.r.t to each Functions
     * @param {String} shortcut 
     */
function runShortCutKey(shortcut) {
    switch (shortcut) {
        case 'ctrl+a':
            this.selectAllCards();
            break;
        case 'delete':
            this.removeSelectedCards();
            break;
        case 'backspace':
            this.removeSelectedCards();
            break;
        case 'ctrl+q':
            //Duplicates the Selected Cards
            this.duplicateCards();
            break;
        case 'alt+r':
            //Removes Selected Duplicate
            this.removeDuplicates();
            break;
        case 'ctrl+alt+r':
            //Removes All Duplicates Without Selection
            this.removeDuplicates('removeAll');
            break;
        case 'ctrl+alt+n':
            if (!this.currentActive && this.cursors && this.cursors[this.userID])
                this.addCard(
                    { x: this.cursors[this.userID].x, y: this.cursors[this.userID].y },
                    { width: 275, height: 45 }, "root", "blank"
                )
            break;
        default: break;
    }
}
/**
 * Select ALL Cards 
 * @param {*} strategy - IF a Particular Card to De-select 
 */
function selectAllCards(strategy) {
    Object.entries(this.cards)
        .filter(([id, value]) => id && id !== "root" && (strategy || !value?.isCollapse))
        .forEach(([id, value]) => {
            if (strategy) {
                this.removeCard(id, "reparent", value.parent)
            }
            else if (!this.selectedCards.includes(id))
                this.selectedCards.push(id);
        })
}
/**
 * Removes Selected Card From 'selectedCards' Array
 */
function removeSelectedCards() {
    if (this.selectedCards.length) {
        this.selectedCards.forEach(id => {
            this.removeCard(id, "reparent", this.cards[id].parent)
        })
        this.selectedCards = [];
    }
}
/**
 * Duplicates Selected Cards with maintaining the relationship between them
 */
function duplicateCards() {
    if (this.selectedCards.length) {
        this.selectedCards.forEach(id => {
            const me = this.cards[id];
            const parent = this.cards[me.parent];
            let newCardKey = this.projectRef.child("nodes").push().key;
            this.addCard(
                { x: me.position.x + me.size.width + 80, y: me.position.y },
                { height: me.size.height, width: me.size.width }
                , parent?.originalOf || me.parent
                , me.type,
                (newCardId) => {
                    console.log("COMPARE ", newCardKey === newCardId)
                    this.saveContent(newCardId, me.content);
                }, newCardKey
            )
            this.saveContent(newCardKey, me.content);
            this.addCardProperty(id, { originalOf: newCardKey });
            this.addCardProperty(newCardKey, { duplicate: id });
        })
    }
}
/**
 * Removes Duplicate Cards
 * @param {*} strategy 
 */
function removeDuplicates(strategy) {
    if (strategy) {
        Object.entries(this.cards)
            .filter(([id, value]) => id && id !== "root" && (value?.originalOf || !value?.duplicate))
            .forEach(([id, value]) => {
                if (value.originalOf) {
                    this.removeCard(value.originalOf, "reparent", value.parent)
                }
                else if (value.duplicate) {
                    this.removeCard(id, "reparent", value.parent);
                }
            })
    }
    else if (this.selectedCards.length) {
        this.selectedCards.forEach(id => {
            let indexOf;
            const me = this.cards[id]
            console.log(this.cards[id])
            if (me?.originalOf) {
                this.removeCard(me?.originalOf, "reparent", me.parent)
            }
            else if (me?.duplicate) {
                this.removeCard(id, "reparent", me.parent);
                indexOf = this.selectedCards.indexOf(id);
            }
            if (indexOf)
                this.selectedCards.splice(indexOf, 1);
        })
    }
}

export {
    runShortCutKey,
    selectAllCards,
    removeSelectedCards,
    duplicateCards,
    removeDuplicates
}