
(function(exports) {
// ==========================================================================
// Project:   SproutCore IndexSet
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */

var get = SC.get, set = SC.set, abs = Math.abs;

function isIndexSet(obj) {
  return obj instanceof SC.IndexSet;
}

/** @private
  iterates through a named range, setting hints every HINT_SIZE indexes
  pointing to the nearest range start.  The passed range must start on a
  range boundary.  It can end anywhere.
*/
function _hint(indexSet, start, length, content) {
  if (content === undefined) content = indexSet._content;

  var skip    = SC.IndexSet.HINT_SIZE,
      next    = abs(content[start]), // start of next range
      loc     = start - (start % skip) + skip, // next hint loc
      lim     = start + length ; // stop

  while (loc < lim) {
    // make sure we are in current rnage
    while ((next !== 0) && (next <= loc)) {
      start = next ;
      next  = abs(content[start]) ;
    }

    // past end
    if (next === 0) {
      delete content[loc];

    // do not change if on actual boundary
    } else if (loc !== start) {
      content[loc] = start ;  // set hint
    }

    loc += skip;
  }
}

/** @private
  Walks a content array and copies its contents to a new array.  For large
  content arrays this is faster than using slice()
*/
function _sliceContent(c) {
  if (c.length < 1000) return c.slice(); // use native when faster
  var cur = 0, ret = [], next = c[0];
  while(next !== 0) {
    ret[cur] = next ;
    cur = (next<0) ? (0-next) : next ;
    next = c[cur];
  }
  ret[cur] = 0;
  _hint(this, 0, cur, ret); // hints are not copied manually - add them
  return ret ;
}

/**
  @class

  A collection of ranges.  You can use an IndexSet to keep track of non-
  continuous ranges of items in a parent array.  IndexSet's are used for
  selection, for managing invalidation ranges and other data-propogation.

  Examples
  ---

        var set = SC.IndexSet.create(ranges) ;
        set.contains(index);
        set.add(index, length);
        set.remove(index, length);

        // uses a backing SC.Array object to return each index
        set.forEach(function(object) { .. })

        // returns the index
        set.forEachIndex(function(index) { ... });

        // returns ranges
        set.forEachRange(function(start, length) { .. });

  Implementation Notes
  ---

  An IndexSet stores indices on the object.  A positive value great than the
  index tells you the end of an occupied range.  A negative values tells you
  the end of an empty range.  A value less than the index is a search
  accelerator.  It tells you the start of the nearest range.

  @extends SC.Enumerable
  @extends SC.MutableEnumerable
  @extends SC.Copyable
  @extends SC.Freezable
  @since SproutCore 1.0
*/
SC.IndexSet = SC.Object.extend(SC.Enumerable, SC.MutableEnumerable, SC.Freezable, SC.Copyable,
/** @scope SC.IndexSet.prototype */ {

  /**
    Walk like a duck.  You should use instanceof instead.

    @deprecated
    @type Boolean
    @default YES
  */
  isIndexSet: YES,

  /**
    Total number of indexes contained in the set

    @type Number
  */
  length: 0,

  /**
    One greater than the largest index currently stored in the set.  This
    is sometimes useful when determining the total range of items covering
    the index set.

    @type Number
  */
  max: 0,

  /**
    The first index included in the set or -1.

    @type Number
  */
  min: function() {
    var content = this._content,
        cur = content[0];
    return (cur === 0) ? -1 : (cur>0) ? 0 : abs(cur);

  }.property('[]').cacheable(),

  /**
    When you create a new index set you can optional pass another index set
    or a starting range to be added to the set.
  */
  init: function(start, length) {
    this._super();

    // optimized method to clone an index set.
    if (start && isIndexSet(start)) {
      this._content = _sliceContent(start._content);
      set(this, 'max', get(start, 'max'));
      set(this, 'length', get(start, 'length'));
      set(this, 'source', get(start, 'source'));

    // otherwise just do a regular add
    } else {
      this._content = [0];
      if (start !== undefined) this.add(start, length);
    }

  },

  /**
    Returns the first index in the set .

    @type Number
  */
  firstObject: function() {
    return get(this, 'length')>0 ? get(this, 'min') : undefined;
  }.property(),

  /**
    Returns the starting index of the nearest range for the specified
    index.

    @param {Number} index
    @returns {Number} starting index
  */
  rangeStartForIndex: function(index) {
    var content = this._content,
        max     = get(this, 'max'),
        ret, next, accel;

    // fast cases
    if (index >= max) return max ;
    if (abs(content[index]) > index) return index ; // we hit a border

    // use accelerator to find nearest content range
    accel = index - (index % SC.IndexSet.HINT_SIZE);
    ret = content[accel];
    if (ret<0 || ret>index) ret = accel;
    next = abs(content[ret]);

    // now step forward through ranges until we find one that includes the
    // index.
    while (next < index) {
      ret = next ;
      next = abs(content[ret]);
    }
    return ret ;
  },

  /**
    Returns YES if the passed index set contains the exact same indexes as
    the receiver.  If you pass any object other than an index set, returns NO.

    @param {Object} obj another object.
    @returns {Boolean}
  */
  isEqual: function(obj) {

    // optimize for some special cases
    if (obj === this) return YES ;
    if (!obj || !isIndexSet(obj) || (get(obj, 'max') !== get(this, 'max')) || (get(obj, 'length') !== get(this, 'length'))) return NO;

    // ok, now we need to actually compare the ranges of the two.
    var lcontent = this._content,
        rcontent = obj._content,
        cur      = 0,
        next     = lcontent[cur];

    do {
      if (rcontent[cur] !== next) return NO ;
      cur = abs(next) ;
      next = lcontent[cur];
    } while (cur !== 0);
    return YES ;
  },

  /**
    Returns the first index in the set before the passed index or null if
    there are no previous indexes in the set.

    @param {Number} index index to check
    @returns {Number} index or -1
  */
  indexBefore: function(index) {

    if (index===0) return -1; // fast path
    index--; // start with previous index

    var content = this._content,
        max     = get(this, 'max'),
        start   = this.rangeStartForIndex(index);
    if (!content) return null;

    // loop backwards until we find a range that is in the set.
    while((start===max) || (content[start]<0)) {
      if (start === 0) return -1 ; // nothing before; just quit
      index = start -1 ;
      start = this.rangeStartForIndex(index);
    }

    return index;
  },

  /**
    Returns the first index in the set after the passed index or null if
    there are no additional indexes in the set.

    @param {Number} index index to check
    @returns {Number} index or -1
  */
  indexAfter: function(index) {
    var content = this._content,
        max     = get(this, 'max'),
        start, next ;
    if (!content || (index>=max)) return -1; // fast path
    index++; // start with next index


    // loop forwards until we find a range that is in the set.
    start = this.rangeStartForIndex(index);
    next  = content[start];
    while(next<0) {
      if (next === 0) return -1 ; //nothing after; just quit
      index = start = abs(next);
      next  = content[start];
    }

    return index;
  },

  /**
    Returns YES if the index set contains the named index

    @param {Number} start index or range
    @param {Number} length optional range length
    @returns {Boolean}
  */
  contains: function(start, length) {
    var content, cur, next, rstart, rnext;

    // normalize input
    if (length === undefined) {
      if (start === null || start === undefined) return NO ;

      if ('number' === typeof start) {
        length = 1 ;

      // if passed an index set, check each receiver range
      } else if (start && isIndexSet(start)) {
        if (start === this) return YES ; // optimization

        content = start._content ;
        cur = 0 ;
        next = content[cur];
        while (next !== 0) {
          if ((next>0) && !this.contains(cur, next-cur)) return NO ;
          cur = abs(next);
          next = content[cur];
        }
        return YES ;

      // passed just a hash range
      } else {
        length = start.length;
        start = start.start;
      }
    }

    rstart = this.rangeStartForIndex(start);
    rnext  = this._content[rstart];

    return (rnext>0) && (rstart <= start) && (rnext >= (start+length));
  },

  /**
    Returns YES if the index set contains any of the passed indexes.  You
    can pass a single index, a range or an index set.

    @param {Number} start index, range, or IndexSet
    @param {Number} length optional range length
    @returns {Boolean}
  */
  intersects: function(start, length) {
    var content, cur, next, lim;

    // normalize input
    if (length === undefined) {
      if ('number' === typeof start) {
        length = 1 ;

      // if passed an index set, check each receiver range
      } else if (start && isIndexSet(start)) {
        if (start === this) return YES ; // optimization

        content = start._content ;
        cur = 0 ;
        next = content[cur];
        while (next !== 0) {
          if ((next>0) && this.intersects(cur, next-cur)) return YES ;
          cur = abs(next);
          next = content[cur];
        }
        return NO ;

      } else {
        length = start.length;
        start = start.start;
      }
    }

    cur     = this.rangeStartForIndex(start);
    content = this._content;
    next    = content[cur];
    lim     = start + length;
    while (cur < lim) {
      if (next === 0) return NO; // no match and at end!
      if ((next > 0) && (next > start)) return YES ; // found a match
      cur = abs(next);
      next = content[cur];
    }
    return NO ; // no match
  },

  /**
    Returns a new IndexSet without the passed range or indexes.   This is a
    convenience over simply cloning and removing.  Does some optimizations.

    @param {Number} start index, range, or IndexSet
    @param {Number} length optional range length
    @returns {SC.IndexSet} new index set
  */
  without: function(start, length) {
    if (start === this) return new SC.IndexSet(); // just need empty set
    return this.copy().remove(start, length);
  },

  /**
    Replace the index set's current content with the passed index set.  This
    is faster than clearing the index set adding the values again.  It is
    useful for when you want to reuse an existing index set.

    @param {Number} start index, Range, or another IndexSet
    @param {Number} length optional length of range.
    @returns {SC.IndexSet} receiver
  */
  replace: function(start, length) {

    if (length === undefined) {
      if ('number' === typeof start) {
        length = 1 ;
      } else if (start && isIndexSet(start)) {
        var oldLen = get(this, 'length'), newLen = get(start, 'length');
        this.enumerableContentWillChange(oldLen, newLen);
        SC.beginPropertyChanges(this);
        this._content = _sliceContent(start._content);
        set(this, 'max', get(start, 'max'));
        set(this, 'length', newLen);
        set(this, 'source', get(start, 'source'));
        SC.endPropertyChanges(this);
        this.enumerableContentDidChange(oldLen, newLen);
        return this ;

      } else {
        length = start.length;
        start  = start.start;
      }
    }

    var oldlen = this.length;
    this._content.length=1;
    this._content[0] = 0;
    this.length = this.max = 0 ; // reset without notifying since add()
    return this.add(start, length);
  },

  /**
    Adds the specified range of indexes to the set.  You can also pass another
    IndexSet to union the contents of the index set with the receiver.

    @param {Number} start index, Range, or another IndexSet
    @param {Number} length optional length of range.
    @returns {SC.IndexSet} receiver
  */
  add: function(start, length) {

    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);

    var content, cur, next, notified;

    // normalize IndexSet input
    if (start && isIndexSet(start)) {
      start.forEachRange(this.add, this);
      return this ;

    } else if (length === undefined) {

      if (start === null || start === undefined) {
        return this; // nothing to do
      } else if ('number' === typeof start) {
        length = 1 ;
      } else {
        length = start.length;
        start = start.start;
      }
    } else if (length === null) length = 1 ;

    // if no length - do nothing. - note captures when length != number
    if (!(length > 0)) return this;


    // special case - appending to end of set
    var max     = get(this, 'max'),
        oldmax  = max,
        delta, value ;

    content = this._content ;

    if (start === max) {

      this.enumerableContentWillChange();
      notified = true;

      // if adding to the end and the end is in set, merge.
      if (start > 0) {
        cur = this.rangeStartForIndex(start-1);
        next = content[cur];

        // just extend range at end
        if (next > 0) {
          delete content[max]; // no 0
          content[cur] = max = start + length ;
          start = cur ;

        // previous range was not in set, just tack onto the end
        } else {
          content[max] = max = start + length;
        }
      } else {
        content[start] = max = length;
      }

      content[max] = 0 ;
      set(this, 'max', max);
      set(this, 'length', get(this, 'length') + length) ;
      length = max - start ;

    // past end of last range, just add as a new range.
    } else if (start > max) {
      this.enumerableContentWillChange();
      notified = true;

      content[max] = 0-start; // empty!
      content[start] = start+length ;
      content[start+length] = 0; // set end
      set(this, 'max', start + length) ;
      set(this, 'length', this.length + length) ;

      // affected range goes from starting range to end of content.
      length = start + length - max ;
      start = max ;

    // otherwise, merge into existing range
    } else {

      // find nearest starting range.  split or join that range
      cur   = this.rangeStartForIndex(start);
      next  = content[cur];
      max   = start + length ;
      delta = 0 ;

      // we are right on a boundary and we had a range or were the end, then
      // go back one more.
      if ((start>0) && (cur === start) && (next <= 0)) {
        cur = this.rangeStartForIndex(start-1);
        next = content[cur] ;
      }

      // previous range is not in set.  splice it here
      if (next < 0) {
        content[cur] = 0-start ;

        // if previous range extends beyond this range, splice afterwards also
        if (abs(next) > max) {
          content[start] = 0-max;
          content[max] = next ;
        } else content[start] = next;

      // previous range is in set.  merge the ranges
      } else {
        start = cur ;
        if (next > max) {
          // delta -= next - max ;
          max = next ;
        }
      }

      // at this point there should be clean starting point for the range.
      // just walk the ranges, adding up the length delta and then removing
      // the range until we find a range that passes last
      cur = start;
      while (cur < max) {
        // get next boundary.  splice if needed - if value is 0, we are at end
        // just skip to last
        value = content[cur];
        if (value === 0) {
          content[max] = 0;
          next = max ;
          delta += max - cur ;

          if (!notified && delta>0) {
            this.enumerableContentWillChange();
            notified = true;
          }

        } else {
          next  = abs(value);
          if (next > max) {
            content[max] = value ;
            next = max ;
          }

          // ok, cur range is entirely inside top range.
          // add to delta if needed
          if (value < 0) {
            delta += next - cur ;
            if (!notified && delta>0) {
              this.enumerableContentWillChange();
              notified = true;
            }
          }
        }

        delete content[cur] ; // and remove range
        cur = next;
      }

      // cur should always === last now.  if the following range is in set,
      // merge in also - don't adjust delta because these aren't new indexes
      if ((cur = content[max]) > 0) {
        delete content[max];
        max = cur ;
      }

      // finally set my own range.
      content[start] = max ;
      if (max > oldmax) set(this, 'max', max) ;

      // adjust length
      set(this, 'length', get(this, 'length') + delta);

      // compute hint range
      length = max - start ;
    }

    _hint(this, start, length);
    if (notified) this.enumerableContentDidChange();
    return this;
  },

  /**
    Removes the specified range of indexes from the set

    @param {Number} start index, Range, or IndexSet
    @param {Number} length optional length of range.
    @returns {SC.IndexSet} receiver
  */
  remove: function(start, length) {

    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);

    // normalize input
    if (length === undefined) {
      if (start === null || start === undefined) {
        return this; // nothing to do

      } else if ('number' === typeof start) {
        length = 1 ;

      // if passed an index set, just add each range in the index set.
      } else if (isIndexSet(start)) {
        start.forEachRange(this.remove, this);
        return this;

      } else {
        length = start.length;
        start = start.start;
      }
    }

    if (!(length > 0)) return this; // handles when length != number

    this.enumerableContentWillChange();

    // special case - appending to end of set
    var max     = get(this, 'max'),
        oldmax  = max,
        content = this._content,
        cur, next, delta, value, last ;

    // if we're past the end, do nothing.
    if (start >= max) return this;

    // find nearest starting range.  split or join that range
    cur   = this.rangeStartForIndex(start);
    next  = content[cur];
    last  = start + length ;
    delta = 0 ;

    // we are right on a boundary and we had a range or were the end, then
    // go back one more.
    if ((start>0) && (cur === start) && (next > 0)) {
      cur = this.rangeStartForIndex(start-1);
      next = content[cur] ;
    }

    // previous range is in set.  splice it here
    if (next > 0) {
      content[cur] = start ;

      // if previous range extends beyond this range, splice afterwards also
      if (next > last) {
        content[start] = last;
        content[last] = next ;
      } else content[start] = next;

    // previous range is not in set.  merge the ranges
    } else {
      start = cur ;
      next  = abs(next);
      if (next > last) {
        last = next ;
      }
    }

    // at this point there should be clean starting point for the range.
    // just walk the ranges, adding up the length delta and then removing
    // the range until we find a range that passes last
    cur = start;
    while (cur < last) {
      // get next boundary.  splice if needed - if value is 0, we are at end
      // just skip to last
      value = content[cur];
      if (value === 0) {
        content[last] = 0;
        next = last ;

      } else {
        next  = abs(value);
        if (next > last) {
          content[last] = value ;
          next = last ;
        }

        // ok, cur range is entirely inside top range.
        // add to delta if needed
        if (value > 0) delta += next - cur ;
      }

      delete content[cur] ; // and remove range
      cur = next;
    }

    // cur should always === last now.  if the following range is not in set,
    // merge in also - don't adjust delta because these aren't new indexes
    if ((cur = content[last]) < 0) {
      delete content[last];
      last = abs(cur) ;
    }

    // set my own range - if the next item is 0, then clear it.
    if (content[last] === 0) {
      delete content[last];
      content[start] = 0 ;
      set(this, 'max', start); //max has changed

    } else {
      content[start] = 0-last ;
    }

    // adjust length
    set(this, 'length', get(this, 'length') - delta);

    // compute hint range
    length = last - start ;

    _hint(this, start, length);
    this.enumerableContentDidChange();
    return this;
  },

  /**
    Clears the set
  */
  clear: function() {
    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);

    var oldLen = get(this, 'length');
    if (oldLen>0) this.enumerableContentWillChange();
    SC.beginPropertyChanges(this);
    this._content.length=1;
    this._content[0] = 0;
    set(this, 'length', 0);
    set(this, 'max', 0);
    SC.endPropertyChanges(this);
    if (oldLen > 0) this.enumerableContentDidChange();
  },

  /**
    Add all the ranges in the passed array.

    @param {Enumerable} objects The list of ranges you want to add
  */
  addEach: function(objects) {
    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);
    SC.beginPropertyChanges(this);
    objects.forEach(function(idx) { this.add(idx); }, this);
    SC.endPropertyChanges(this);
    return this ;
  },

  /**
    Removes all the ranges in the passed array.

    @param {Object...} objects The list of objects you want to remove
  */
  removeEach: function(objects) {
    if (get(this, 'isFrozen')) throw new Error(SC.FROZEN_ERROR);
    SC.beginPropertyChanges(this);
    objects.forEach(function(idx) { this.remove(idx); }, this);
    SC.endPropertyChanges(this);
    return this ;
  },

  /**
   Clones the set into a new set.
  */
  copy: function() {
    return new SC.IndexSet(this);
  },

  /** @private (nodoc) */
  clone: SC.alias('copy'),

  /** @private (nodoc) */
  slice: SC.alias('copy'),

  /**
    Returns a string describing the internal range structure.  Useful for
    debugging.

    @returns {String}
  */
  inspect: function() {
    var content = this._content,
        len     = content.length,
        idx     = 0,
        ret     = [],
        item;

    for(idx=0;idx<len;idx++) {
      item = content[idx];
      if (item !== undefined) ret.push("%@:%@".fmt(idx,item));
    }
    return "SC.IndexSet<%@>".fmt(ret.join(' , '));
  },

  /**
    Invoke the callback, passing each occuppied range instead of each
    index.  This can be a more efficient way to iterate in some cases.  The
    callback should have the signature:

          callback(start, length, indexSet, source) { ... }

    If you pass a target as a second option, the callback will be called in
    the target context.

    @param {Function} callback The method to run on each iteration
    @param {Object} target the object to call the callback on
    @returns {SC.IndexSet} receiver
  */
  forEachRange: function(callback, target) {
    var content = this._content,
        cur     = 0,
        next    = content[cur],
        source  = this.source;

    if (target === undefined) target = null ;
    while (next !== 0) {
      if (next > 0) callback.call(target, cur, next - cur, this, source);
      cur  = abs(next);
      next = content[cur];
    }

    return this ;
  },

  /**
    Invokes the callback for each index within the passed start/length range.
    Otherwise works just like regular forEach().

    @param {Number} start starting index
    @param {Number} length length of range
    @param {Function} callback
    @param {Object} target
    @returns {SC.IndexSet} receiver
  */
  forEachIn: function(start, length, callback, target) {
    var content = this._content,
        cur     = 0,
        idx     = 0,
        lim     = start + length,
        source  = this.source,
        next    = content[cur];

    if (target === undefined) target = null ;
    while (next !== 0) {
      if (cur < start) cur = start ; // skip forward
      while((cur < next) && (cur < lim)) {
        callback.call(target, cur++, idx++, this, source);
      }

      if (cur >= lim) {
        cur = next = 0 ;
      } else {
        cur  = abs(next);
        next = content[cur];
      }
    }
    return this ;
  },

  /**
    Total number of indexes within the specified range.

    @param {Number|SC.IndexSet} start index, range object or IndexSet
    @param {Number} length optional range length
    @returns {Number} count of indexes
  */
  lengthIn: function(start, length) {

    var ret = 0 ;

    // normalize input
    if (length === undefined) {
      if (start === null || start === undefined) {
        return 0; // nothing to do

      } else if ('number' === typeof start) {
        length = 1 ;

      // if passed an index set, just add each range in the index set.
      } else if (isIndexSet(start)) {
        start.forEachRange(function(start, length) {
          ret += this.lengthIn(start, length);
        }, this);
        return ret;

      } else {
        length = start.length;
        start = start.start;
      }
    }

    // fast path
    if (get(this, 'length') === 0) return 0;

    var content = this._content,
        cur     = 0,
        next    = content[cur],
        lim     = start + length ;

    while (cur<lim && next !== 0) {
      if (next>0) {
        ret += (next>lim) ? lim-cur : next-cur;
      }
      cur  = abs(next);
      next = content[cur];
    }

    return ret ;
  },

  // ..........................................................
  // OBJECT API
  //

  /**
    Optionally set the source property on an index set and then you can
    iterate over the actual object values referenced by the index set.  See
    indexOf(), lastIndexOf(), forEachObject(), addObject() and removeObject().
  */
  source: null,

  /**
    Returns the first index in the set that matches the passed object.  You
    must have a source property on the set for this to work.

    @param {Object} object the object to check
    @param {Number} startAt optional starting point
    @returns {Number} found index or -1 if not in set
  */
  indexOf: function(object, startAt) {
    var source  = get(this, 'source');
    if (!source) throw "%@.indexOf() requires source".fmt(this);

    var len     = get(source, 'length'),

        // start with the first index in the set
        content = this._content,
        cur     = content[0]<0 ? abs(content[0]) : 0,
        idx ;

    while(cur>=0 && cur<len) {
      idx = source.indexOf(object, cur);
      if (idx<0) return -1 ; // not found in source
      if (this.contains(idx)) return idx; // found in source and in set.
      cur = idx+1;
    }

    return -1; // not found
  },

  /**
    Returns the last index in the set that matches the passed object.  You
    must have a source property on the set for this to work.

    @param {Object} object the object to check
    @param {Number} startAt optional starting point
    @returns {Number} found index or -1 if not in set
  */
  lastIndexOf: function(object, startAt) {
    var source  = get(this, 'source');
    if (!source) throw "%@.lastIndexOf() requires source".fmt(this);

    // start with the last index in the set
    var len     = get(source, 'length'),
        cur     = get(this, 'max')-1,
        idx ;

    if (cur >= len) cur = len-1;
    while (cur>=0) {
      idx = source.lastIndexOf(object, cur);
      if (idx<0) return -1 ; // not found in source
      if (this.contains(idx)) return idx; // found in source and in set.
      cur = idx+1;
    }

    return -1; // not found
  },

  /**
    Iterates through the objects at each index location in the set.  You must
    have a source property on the set for this to work.  The callback you pass
    will be invoked for each object in the set with the following signature:

          function callback(object, index, source, indexSet) { ... }

    If you pass a target, it will be used when the callback is called.

    @param {Function} callback function to invoke.
    @param {Object} target optional content. otherwise uses window
    @returns {SC.IndexSet} receiver
  */
  forEachObject: function(callback, target) {
    var source  = get(this, 'source');
    if (!source) throw "%@.forEachObject() requires source".fmt(this);

    var content = this._content,
        cur     = 0,
        idx     = 0,
        next    = content[cur];

    if (target === undefined) target = null ;
    while (next !== 0) {

      while(cur < next) {
        callback.call(target, source.objectAt(cur), cur, source, this);
        cur++;
      }

      cur  = abs(next);
      next = content[cur];
    }
    return this ;
  },

  /**
    Adds all indexes where the object appears to the set.  If firstOnly is
    passed, then it will find only the first index and add it.  If  you know
    the object only appears in the source array one time, firstOnly may make
    this method faster.

    Requires source to work.

    @param {Object} object the object to add
    @param {Boolean} firstOnly Set to true if you can assume that the first
       match is the only one
    @returns {SC.IndexSet} receiver
  */
  addObject: function(object, firstOnly) {
    var source  = get(this, 'source');
    sc_assert("%@.addObject() requires source".fmt(this), !!source);

    var len = get(source, 'length'),
        cur = 0, idx;

    while(cur>=0 && cur<len) {
      idx = source.indexOf(object, cur);
      if (idx >= 0) {
        this.add(idx);
        if (firstOnly) return this ;
        cur = idx++;
      } else return this ;
    }
    return this ;
  },

  /**
    Adds any indexes matching the passed objects.  If firstOnly is passed,
    then only finds the first index for each object.

    @param {SC.Enumerable} objects the objects to add
    @param {Boolean} firstOnly Set to true if you can assume that the first
       match is the only one
    @returns {SC.IndexSet} receiver
  */
  addObjects: function(objects, firstOnly) {
    objects.forEach(function(object) {
      this.addObject(object, firstOnly);
    }, this);
    return this;
  },

  /**
    Removes all indexes where the object appears to the set.  If firstOnly is
    passed, then it will find only the first index and add it.  If  you know
    the object only appears in the source array one time, firstOnly may make
    this method faster.

    Requires source to work.

    @param {Object} object the object to add
    @param {Boolean} firstOnly Set to true if you can assume that the first
       match is the only one
    @returns {SC.IndexSet} receiver
  */
  removeObject: function(object, firstOnly) {
    var source  = get(this, 'source');
    sc_assert("%@.removeObject() requires source".fmt(this), !!source);

    var len = source.get('length'),
        cur = 0, idx;

    while(cur>=0 && cur<len) {
      idx = source.indexOf(object, cur);
      if (idx >= 0) {
        this.remove(idx);
        if (firstOnly) return this ;
        cur = idx+1;
      } else return this ;
    }
    return this ;
  },

  /**
    Removes any indexes matching the passed objects.  If firstOnly is passed,
    then only finds the first index for each object.

    @param {SC.Enumerable} objects the objects to add
    @param {Boolean} firstOnly Set to true if you can assume that the first
       match is the only one
    @returns {SC.IndexSet} receiver
  */
  removeObjects: function(objects, firstOnly) {
    objects.forEach(function(object) {
      this.removeObject(object, firstOnly);
    }, this);
    return this;
  },


  // .......................................
  // PRIVATE
  //

  /**
    Usually observing notifications from IndexSet are not useful, so
    supress them by default.

    @type Boolean
    @default NO
  */
  LOG_OBSERVING: NO,

  /** @private - optimized call to forEach() */
  forEach: function(callback, target) {
    var content = this._content,
        cur     = 0,
        idx     = 0,
        source  = get(this, 'source'),
        next    = content[cur];

    if (target === undefined) target = null ;
    while (next !== 0) {
      while(cur < next) {
        callback.call(target, cur++, idx++, this, source);
      }
      cur  = abs(next);
      next = content[cur];
    }
    return this ;
  },

  /** @private - support iterators */
  nextObject: function(ignore, idx, context) {
    var content = this._content,
        next    = context.next,
        max     = get(this, 'max'); // next boundary

    // seed.
    if (idx === null) {
      idx = next = 0 ;

    } else if (idx >= max) {
      delete context.next; // cleanup context
      return null ; // nothing left to do

    } else idx++; // look on next index

    // look for next non-empty range if needed.
    if (idx === next) {
      do {
        idx = abs(next);
        next = content[idx];
      } while(next < 0);
      context.next = next;
    }

    return idx;
  },

  toString: function() {
    var str = [];
    this.forEachRange(function(start, length) {
      str.push(length === 1 ? start : "%@..%@".fmt(start, start + length - 1));
    }, this);
    return "SC.IndexSet<%@>".fmt(str.join(',')) ;
  }

}) ;

SC.IndexSet.reopenClass({

  /**
    Create can take a simple range as well..
  */
  create: function(start, length) {
    if ('number' === typeof start || isIndexSet(start)) {
      var C = this;
      return new C(start, length);
    } else {
      return this._super.apply(this, arguments);
    }
  },

  /**  @private
    Internal setting determines the preferred skip size for hinting sets.

    @type Number
  */
  HINT_SIZE: 256,

  /**
    A empty index set.  Useful for common comparisons.

    @type SC.IndexSet
  */
  EMPTY: new SC.IndexSet().freeze()

});


})({});


(function(exports) {

})({});

(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var get = SC.get, set = SC.set, getPath = SC.getPath;

/**
  @class

  This permits you to perform queries on your data store,
  written in a SQL-like language. Here is a simple example:

      q = SC.Query.create({
        conditions: "firstName = 'Jonny' AND lastName = 'Cash'"
      })

  You can check if a certain record matches the query by calling

      q.contains(record)

  To find all records of your store, that match query q, use findAll with
  query q as argument:

      r = MyApp.store.findAll(q)

  `r` will be a record array containing all matching records.
  To limit the query to a record type of `MyApp.MyModel`,
  you can specify the type as a property of the query like this:

      q = SC.Query.create({
        conditions: "firstName = 'Jonny' AND lastName = 'Cash'",
        recordType: MyApp.MyModel
      })

  Calling `find()` like above will now return only records of type t.
  It is recommended to limit your query to a record type, since the query will
  have to look for matching records in the whole store, if no record type
  is given.

  You can give an order, which the resulting records should follow, like this:

      q = SC.Query.create({
        conditions: "firstName = 'Jonny' AND lastName = 'Cash'",
        recordType: MyApp.MyModel,
        orderBy: "lastName, year DESC"
      });

  The default order direction is ascending. You can change it to descending
  by writing `'DESC'` behind the property name like in the example above.
  If no order is given, or records are equal in respect to a given order,
  records will be ordered by guid.

  SproutCore Query Language
  =====

  Features of the query language:

  Primitives:

   - record properties
   - `null`, `undefined`
   - `true`, `false`
   - numbers (integers and floats)
   - strings (double or single quoted)

  Parameters:

   - `%@` (wild card)
   - `{parameterName}` (named parameter)

  Wild cards are used to identify parameters by the order in which they appear
  in the query string. Named parameters can be used when tracking the order
  becomes difficult. Both types of parameters can be used by giving the
  parameters as a property to your query object:

      yourQuery.parameters = yourParameters

  where yourParameters should have one of the following formats:

   * for wild cards: `[firstParam, secondParam, thirdParam]`
   * for named params: `{name1: param1, mane2: parma2}`

  You cannot use both types of parameters in a single query!

  Operators:

   - `=`
   - `!=`
   - `<`
   - `<=`
   - `>`
   - `>=`
   - `BEGINS_WITH` -- (checks if a string starts with another one)
   - `ENDS_WITH` --   (checks if a string ends with another one)
   - `CONTAINS` --    (checks if a string contains another one, or if an
                      object is in an array)
   - `MATCHES` --     (checks if a string is matched by a regexp,
                      you will have to use a parameter to insert the regexp)
   - `ANY` --         (checks if the thing on its left is contained in the array
                      on its right, you will have to use a parameter
                      to insert the array)
   - `TYPE_IS` --     (unary operator expecting a string containing the name
                      of a Model class on its right side, only records of this
                      type will match)

  Boolean Operators:

   - `AND`
   - `OR`
   - `NOT`

  Parenthesis for grouping:

   - `(` and `)`


  Adding Your Own Query Handlers
  ---

  You can extend the query language with your own operators by calling:

      SC.Query.registerQueryExtension('your_operator', your_operator_definition);

  See details below. As well you can provide your own comparison functions
  to control ordering of specific record properties like this:

      SC.Query.registerComparison(property_name, comparison_for_this_property);

  Examples

  Some example queries:

  TODO add examples

  @extends SC.Object
  @extends SC.Copyable
  @extends SC.Freezable
  @since SproutCore 1.0
*/

SC.Query = SC.Object.extend(SC.Copyable, SC.Freezable,
  /** @scope SC.Query.prototype */ {

  // ..........................................................
  // PROPERTIES
  //

  /**
    Walk like a duck.

    @type Boolean
  */
  isQuery: YES,

  /**
    Unparsed query conditions.  If you are handling a query yourself, then
    you will find the base query string here.

    @type String
  */
  conditions:  null,

  /**
    Optional orderBy parameters.  This can be a string of keys, optionally
    beginning with the strings `"DESC "` or `"ASC "` to select descending or
    ascending order.

    Alternatively, you can specify a comparison function, in which case the
    two records will be sent to it.  Your comparison function, as with any
    other, is expected to return -1, 0, or 1.

    @type String | Function
  */
  orderBy:     null,

  /**
    The base record type or types for the query.  This must be specified to
    filter the kinds of records this query will work on.  You may either
    set this to a single record type or to an array or set of record types.

    @type SC.Record
  */
  recordType:  null,

  /**
    Optional array of multiple record types.  If the query accepts multiple
    record types, this is how you can check for it.

    @type SC.Enumerable
  */
  recordTypes: null,

  /**
    Returns the complete set of `recordType`s matched by this query.  Includes
    any named `recordType`s plus their subclasses.

    @property
    @type SC.Enumerable
  */
  expandedRecordTypes: function() {
    var ret = SC.Set.create(), rt, q  ;

    if (rt = get(this, 'recordType')) this._scq_expandRecordType(rt, ret);
    else if (rt = get(this, 'recordTypes')) {
      rt.forEach(function(t) { this._scq_expandRecordType(t, ret); }, this);
    } else this._scq_expandRecordType(SC.Record, ret);

    // save in queue.  if a new recordtype is defined, we will be notified.
    q = SC.Query._scq_queriesWithExpandedRecordTypes;
    if (!q) {
      q = SC.Query._scq_queriesWithExpandedRecordTypes = SC.Set.create();
    }
    q.add(this);

    return ret.freeze() ;
  }.property('recordType', 'recordTypes').cacheable(),

  /** @private
    expands a single record type into the set. called recursively
  */
  _scq_expandRecordType: function(recordType, set) {
    if (set.contains(recordType)) return; // nothing to do
    set.add(recordType);

    if (SC.typeOf(recordType)==='string') {
      recordType = getPath( recordType);
    }

    recordType.subclasses.forEach(function(t) {
      this._scq_expandRecordType(t, set);
    }, this);
  },

  /**
    Optional hash of parameters.  These parameters may be interpolated into
    the query conditions.  If you are handling the query manually, these
    parameters will not be used.

    @type Hash
  */
  parameters:  null,

  /**
    Indicates the location where the result set for this query is stored.
    Currently the available options are:

     - `SC.Query.LOCAL` -- indicates that the query results will be
       automatically computed from the in-memory store.
     - `SC.Query.REMOTE` -- indicates that the query results are kept on a
       remote server and hence must be loaded from the `DataSource`.

    The default setting for this property is `SC.Query.LOCAL`.

    Note that even if a query location is `LOCAL`, your `DataSource` will
    still have its `fetch()` method called for the query.  For `LOCAL`
    queries, you  won't need to explicitly provide the query result set; you
    can just load records into the in-memory store as needed and let the query
    recompute automatically.

    If your query location is `REMOTE`, then your `DataSource` will need to
    provide the actual set of query results manually.  Usually you will only
    need to use a `REMOTE` query if you are retrieving a large data set and you
    don't want to pay the cost of computing the result set client side.

    @type String
  */
  location: 'local', // SC.Query.LOCAL

  /**
    Another query that will optionally limit the search of records.  This is
    usually configured for you when you do `find()` from another record array.

    @type SC.Query
  */
  scope: null,


  /**
    Returns `YES` if query location is Remote.  This is sometimes more
    convenient than checking the location.

		@property
    @type Boolean
  */
  isRemote: function() {
    return get(this, 'location') === SC.Query.REMOTE;
  }.property('location').cacheable(),

  /**
    Returns `YES` if query location is Local.  This is sometimes more
    convenient than checking the location.

		@property
    @type Boolean
  */
  isLocal: function() {
    return get(this, 'location') === SC.Query.LOCAL;
  }.property('location').cacheable(),

  /**
    Indicates whether a record is editable or not.  Defaults to `NO`.  Local
    queries should never be made editable.  Remote queries may be editable or
    not depending on the data source.
  */
  isEditable: NO,

  // ..........................................................
  // PRIMITIVE METHODS
  //

  /**
    Returns `YES` if record is matched by the query, `NO` otherwise.  This is
    used when computing a query locally.

    @param {SC.Record} record the record to check
    @param {Hash} parameters optional override parameters
    @returns {Boolean} YES if record belongs, NO otherwise
  */
  contains: function(record, parameters) {

    // check the recordType if specified
    var rtype, ret = YES ;
    if (rtype = get(this, 'recordTypes')) { // plural form
      ret = rtype.find(function(t) { return (record instanceof  t); });
    } else if (rtype = get(this, 'recordType')) { // singular
      ret = (record instanceof  rtype);
    }

    if (!ret) return NO ; // if either did not pass, does not contain

    // if we have a scope - check for that as well
    var scope = get(this, 'scope');
    if (scope && !scope.contains(record)) return NO ;

    // now try parsing
    if (!this._isReady) this.parse(); // prepare the query if needed
    if (!this._isReady) return NO ;
    if (parameters === undefined) parameters = this.parameters || this;

    // if parsing worked we check if record is contained
    // if parsing failed no record will be contained
    return this._tokenTree.evaluate(record, parameters);
  },

  /**
    Returns `YES` if the query matches one or more of the record types in the
    passed set.

    @param {SC.Set} types set of record types
    @returns {Boolean} YES if record types match
  */
  containsRecordTypes: function(types) {
    var rtype = get(this, 'recordType');
    if (rtype) {
      return !!types.find(function(t) { return rtype.detect(t); });

    } else if (rtype = get(this, 'recordTypes')) {
      return !!rtype.find(function(t) {
        return !!types.find(function(t2) { return t.detect(t2); });
      });

    } else return YES; // allow anything through
  },

  /**
    Returns the sort order of the two passed records, taking into account the
    orderBy property set on this query.  This method does not verify that the
    two records actually belong in the query set or not; this is checked using
    `contains()`.

    @param {SC.Record} record1 the first record
    @param {SC.Record} record2 the second record
    @returns {Number} -1 if record1 < record2,
                      +1 if record1 > record2,
                      0 if equal
  */
  compare: function(record1, record2) {
    // IMPORTANT:  THIS CODE IS ALSO INLINED INSIDE OF THE 'compareStoreKeys'
    //             CLASS METHOD.  IF YOU CHANGE THIS IMPLEMENTATION, BE SURE
    //             TO UPDATE IT THERE, TOO.
    //
    // (Any clients overriding this method will have their version called,
    // however.  That's why we'll keep this here; clients might want to
    // override it and call this._super()).

    var result = 0,
        propertyName, order, len, i;

    // fast cases go here
    if (record1 === record2) return 0;

    // if called for the first time we have to build the order array
    if (!this._isReady) this.parse();
    if (!this._isReady) { // can't parse. guid is wrong but consistent
      return SC.compare(get(record1, 'id'),get(record2, 'id'));
    }

    // For every property specified in orderBy until non-eql result is found.
    // Or, if orderBy is a comparison function, simply invoke it with the
    // records.
    order = this._order;
    if (SC.typeOf(order) === 'function') {
      result = order.call(null, record1, record2);
    }
    else {
      len   = order ? order.length : 0;
      for (i=0; result===0 && (i < len); i++) {
        propertyName = order[i].propertyName;
        // if this property has a registered comparison use that
        if (SC.Query.comparisons[propertyName]) {
          result = SC.Query.comparisons[propertyName](
                    get(record1, propertyName),get(record2, propertyName));

        // if not use default SC.compare()
        } else {
          result = SC.compare(
                    get(record1, propertyName), get(record2, propertyName) );
        }

        if ((result!==0) && order[i].descending) result = (-1) * result;
      }
    }

    // return result or compare by guid
    if (result !== 0) return result ;
    else return SC.compare(get(record1, 'id'),get(record2, 'id'));
  },

  /** @private
      Becomes YES once the query has been successfully parsed
  */
  _isReady:     NO,

  /**
    This method has to be called before the query object can be used.
    You will normaly not have to do this; it will be called automatically
    if you try to evaluate a query.
    You can, however, use this function for testing your queries.

    @returns {Boolean} true if parsing succeeded, false otherwise
  */
  parse: function() {
    var conditions = get(this, 'conditions'),
        lang       = get(this, 'queryLanguage'),
        tokens, tree;

    tokens = this._tokenList = this.tokenizeString(conditions, lang);
    tree = this._tokenTree = this.buildTokenTree(tokens, lang);
    this._order = this.buildOrder(get(this, 'orderBy'));

    this._isReady = !!tree && !tree.error;
    if (tree && tree.error) throw tree.error;
    return this._isReady;
  },

  /**
    Returns the same query but with the scope set to the passed record array.
    This will copy the receiver.  It also stores these queries in a cache to
    reuse them if possible.

    @param {SC.RecordArray} recordArray the scope
    @returns {SC.Query} new query
  */
  queryWithScope: function(recordArray) {
    // look for a cached query on record array.
    var key = '__query__'+SC.guidFor(this),
        ret = recordArray[key];

    if (!ret) {
      recordArray[key] = ret = this.copy();
      set(ret, 'scope', recordArray);
      ret.freeze();
    }

    return ret ;
  },

  // ..........................................................
  // PRIVATE SUPPORT
  //

  /** @private
    Properties that need to be copied when cloning the query.
  */
  copyKeys: ['conditions', 'orderBy', 'recordType', 'recordTypes', 'parameters', 'location', 'scope'],

  /** @private */
  concatenatedProperties: ['copyKeys'],

  /** @private
    Implement the Copyable API to clone a query object once it has been
    created.
  */
  copy: function() {
    var opts = {},
        keys = get(this, 'copyKeys'),
        loc  = keys ? keys.length : 0,
        key, value, ret;

    while(--loc >= 0) {
      key = keys[loc];
      value = get(this, key);
      if (value !== undefined) opts[key] = value ;
    }

    ret = this.constructor.create(opts);
    opts = null;
    return ret ;
  },

  // ..........................................................
  // QUERY LANGUAGE DEFINITION
  //


  /**
    This is the definition of the query language. You can extend it
    by using `SC.Query.registerQueryExtension()`.
  */
  queryLanguage: {

    'UNKNOWN': {
      firstCharacter:   /[^\s'"\w\d\(\)\{\}]/,
      notAllowed:       /[\-\s'"\w\d\(\)\{\}]/
    },

    'PROPERTY': {
      firstCharacter:   /[a-zA-Z_]/,
      notAllowed:       /[^a-zA-Z_0-9\.]/,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) {
                          return SC.getPath(r, this.tokenValue);
                        }
    },

    'NUMBER': {
      firstCharacter:   /[\d\-]/,
      notAllowed:       /[^\d\-\.]/,
      format:           /^-?\d+$|^-?\d+\.\d+$/,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return parseFloat(this.tokenValue); }
    },

    'STRING': {
      firstCharacter:   /['"]/,
      delimeted:        true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return this.tokenValue; }
    },

    'PARAMETER': {
      firstCharacter:   /\{/,
      lastCharacter:    '}',
      delimeted:        true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return w[this.tokenValue]; }
    },

    '%@': {
      rememberCount:    true,
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return w[this.tokenValue]; }
    },

    'OPEN_PAREN': {
      firstCharacter:   /\(/,
      singleCharacter:  true
    },

    'CLOSE_PAREN': {
      firstCharacter:   /\)/,
      singleCharacter:  true
    },

    'AND': {
      reservedWord:     true,
      leftType:         'BOOLEAN',
      rightType:        'BOOLEAN',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left && right;
                        }
    },

    'OR': {
      reservedWord:     true,
      leftType:         'BOOLEAN',
      rightType:        'BOOLEAN',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left || right;
                        }
    },

    'NOT': {
      reservedWord:     true,
      rightType:        'BOOLEAN',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var right = this.rightSide.evaluate(r,w);
                          return !right;
                        }
    },

    '=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return SC.isEqual(left, right);
                        }
    },

    '!=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return !SC.isEqual(left, right);
                        }
    },

    '<': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return SC.compare(left, right) == -1; //left < right;
                        }
    },

    '<=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return SC.compare(left, right) != 1; //left <= right;
                        }
    },

    '>': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return SC.compare(left, right) == 1; //left > right;
                        }
    },

    '>=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return SC.compare(left, right) != -1; //left >= right;
                        }
    },

    'BEGINS_WITH': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var all   = this.leftSide.evaluate(r,w);
                          var start = this.rightSide.evaluate(r,w);
                          return ( all && all.indexOf(start) === 0 );
                        }
    },

    'ENDS_WITH': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var all = this.leftSide.evaluate(r,w);
                          var end = this.rightSide.evaluate(r,w);
                          return ( all && all.indexOf(end) === (all.length - end.length) );
                        }
    },

    'CONTAINS': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
        evaluate:       function (r,w) {
                          var all    = this.leftSide.evaluate(r,w) || [];
                          var value = this.rightSide.evaluate(r,w);

                          var allType = SC.typeOf(all);
                          if (allType === 'string') {
                            return (all.indexOf(value) !== -1);
                          } else if (allType === 'array' || all.toArray) {
                            if (allType !== 'array') all = all.toArray();
                            var found  = false;
                            var i      = 0;
                            while ( found===false && i<all.length ) {
                              if ( value == all[i] ) found = true;
                              i++;
                            }
                            return found;
                          }
                        }
    },

    'ANY': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var prop   = this.leftSide.evaluate(r,w);
                          var values = this.rightSide.evaluate(r,w);
                          var found  = false;
                          var i      = 0;
                          while ( found===false && i<values.length ) {
                            if ( prop == values[i] ) found = true;
                            i++;
                          }
                          return found;
                        }
    },

    'MATCHES': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var toMatch = this.leftSide.evaluate(r,w);
                          var matchWith = this.rightSide.evaluate(r,w);
                          return matchWith.test(toMatch);
                        }
    },

    'TYPE_IS': {
      reservedWord:     true,
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var actualType = SC.Store.recordTypeFor(r.storeKey);
                          var right      = this.rightSide.evaluate(r,w);
                          var expectType = getPath( right);
                          return actualType == expectType;
                        }
    },

    'null': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return null; }
    },

    'undefined': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return undefined; }
    },

    'false': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return false; }
    },

    'true': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return true; }
    },

    'YES': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return true; }
    },

    'NO': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return false; }
    }

  },


  // ..........................................................
  // TOKENIZER
  //


  /**
    Takes a string and tokenizes it based on the grammar definition
    provided. Called by `parse()`.

    @param {String} inputString the string to tokenize
    @param {Object} grammar the grammar definition (normally queryLanguage)
    @returns {Array} list of tokens
  */
  tokenizeString: function (inputString, grammar) {


    var tokenList           = [],
        c                   = null,
        t                   = null,
        token               = null,
        tokenType           = null,
        currentToken        = null,
        currentTokenType    = null,
        currentTokenValue   = null,
        currentDelimeter    = null,
        endOfString         = false,
        endOfToken          = false,
        belongsToToken      = false,
        skipThisCharacter   = false,
        rememberCount       = {};


    // helper function that adds tokens to the tokenList

    function addToken (tokenType, tokenValue) {
      t = grammar[tokenType];
      //tokenType = t.tokenType;

      // handling of special cases
      // check format
      if (t.format && !t.format.test(tokenValue)) tokenType = "UNKNOWN";
      // delimeted token (e.g. by ")
      if (t.delimeted) skipThisCharacter = true;

      // reserved words
      if ( !t.delimeted ) {
        for ( var anotherToken in grammar ) {
          if ( grammar[anotherToken].reservedWord
               && anotherToken == tokenValue ) {
            tokenType = anotherToken;
          }
        }
      }

      // reset t
      t = grammar[tokenType];
      // remembering count type
      if ( t && t.rememberCount ) {
        if (!rememberCount[tokenType]) rememberCount[tokenType] = 0;
        tokenValue = rememberCount[tokenType];
        rememberCount[tokenType] += 1;
      }

      // push token to list
      tokenList.push( {tokenType: tokenType, tokenValue: tokenValue} );

      // and clean up currentToken
      currentToken      = null;
      currentTokenType  = null;
      currentTokenValue = null;
    }


    // stepping through the string:

    if (!inputString) return [];

    var iStLength = inputString.length;

    for (var i=0; i < iStLength; i++) {

      // end reached?
      endOfString = (i===iStLength-1);

      // current character
      c = inputString.charAt(i);

      // set true after end of delimeted token so that
      // final delimeter is not catched again
      skipThisCharacter = false;


      // if currently inside a token

      if ( currentToken ) {

        // some helpers
        t = grammar[currentToken];
        endOfToken = t.delimeted ? c===currentDelimeter : t.notAllowed.test(c);

        // if still in token
        if ( !endOfToken ) currentTokenValue += c;

        // if end of token reached
        if (endOfToken || endOfString) {
          addToken(currentToken, currentTokenValue);
        }

        // if end of string don't check again
        if ( endOfString && !endOfToken ) skipThisCharacter = true;
      }

      // if not inside a token, look for next one

      if ( !currentToken && !skipThisCharacter ) {
        // look for matching tokenType
        for ( token in grammar ) {
          t = grammar[token];
          if (t.firstCharacter && t.firstCharacter.test(c)) {
            currentToken = token;
          }
        }

        // if tokenType found
        if ( currentToken ) {
          t = grammar[currentToken];
          currentTokenValue = c;
          // handling of special cases
          if ( t.delimeted ) {
            currentTokenValue = "";
            if ( t.lastCharacter ) currentDelimeter = t.lastCharacter;
            else currentDelimeter = c;
          }

          if ( t.singleCharacter || endOfString ) {
            addToken(currentToken, currentTokenValue);
          }
        }
      }
    }

    return tokenList;
  },



  // ..........................................................
  // BUILD TOKEN TREE
  //

  /**
    Takes an array of tokens and returns a tree, depending on the
    specified tree logic. The returned object will have an error property
    if building of the tree failed. Check it to get some information
    about what happend.
    If everything worked, the tree can be evaluated by calling

        tree.evaluate(record, parameters)

    If `tokenList` is empty, a single token will be returned which will
    evaluate to true for all records.

    @param {Array} tokenList the list of tokens
    @param {Object} treeLogic the logic definition (normally queryLanguage)
    @returns {Object} token tree
  */
  buildTokenTree: function (tokenList, treeLogic) {

    var l                    = tokenList.slice();
    var i                    = 0;
    var openParenthesisStack = [];
    var shouldCheckAgain     = false;
    var error                = [];


    // empty tokenList is a special case
    if (!tokenList || tokenList.length === 0) {
      return { evaluate: function(){ return true; } };
    }


    // some helper functions

    function tokenLogic (position) {
      var p = position;
      if ( p < 0 ) return false;

      var tl = treeLogic[l[p].tokenType];

      if ( ! tl ) {
        error.push("logic for token '"+l[p].tokenType+"' is not defined");
        return false;
      }

      // save evaluate in token, so that we don't have
      // to look it up again when evaluating the tree
      l[p].evaluate = tl.evaluate;
      return tl;
    }

    function expectedType (side, position) {
      var p = position;
      var tl = tokenLogic(p);
      if ( !tl )            return false;
      if (side == 'left')   return tl.leftType;
      if (side == 'right')  return tl.rightType;
    }

    function evalType (position) {
      var p = position;
      var tl = tokenLogic(p);
      if ( !tl )  return false;
      else        return tl.evalType;
    }

    function removeToken (position) {
      l.splice(position, 1);
      if ( position <= i ) i--;
    }

    function preceedingTokenExists (position) {
      var p = position || i;
      if ( p > 0 )  return true;
      else          return false;
    }

    function tokenIsMissingChilds (position) {
      var p = position;
      if ( p < 0 )  return true;
      return (expectedType('left',p) && !l[p].leftSide)
          || (expectedType('right',p) && !l[p].rightSide);
    }

    function typesAreMatching (parent, child) {
      var side = (child < parent) ? 'left' : 'right';
      if ( parent < 0 || child < 0 )                      return false;
      if ( !expectedType(side,parent) )                   return false;
      if ( !evalType(child) )                             return false;
      if ( expectedType(side,parent) == evalType(child) ) return true;
      else                                                return false;
    }

    function preceedingTokenCanBeMadeChild (position) {
      var p = position;
      if ( !tokenIsMissingChilds(p) )   return false;
      if ( !preceedingTokenExists(p) )  return false;
      if ( typesAreMatching(p,p-1) )    return true;
      else                              return false;
    }

    function preceedingTokenCanBeMadeParent (position) {
      var p = position;
      if ( tokenIsMissingChilds(p) )    return false;
      if ( !preceedingTokenExists(p) )  return false;
      if ( !tokenIsMissingChilds(p-1) ) return false;
      if ( typesAreMatching(p-1,p) )    return true;
      else                              return false;
    }

    function makeChild (position) {
      var p = position;
      if (p<1) return false;
      l[p].leftSide = l[p-1];
      removeToken(p-1);
    }

    function makeParent (position) {
      var p = position;
      if (p<1) return false;
      l[p-1].rightSide = l[p];
      removeToken(p);
    }

    function removeParenthesesPair (position) {
      removeToken(position);
      removeToken(openParenthesisStack.pop());
    }

    // step through the tokenList

    for (i=0; i < l.length; i++) {
      shouldCheckAgain = false;

      if ( l[i].tokenType == 'UNKNOWN' ) {
        error.push('found unknown token: '+l[i].tokenValue);
      }

      if ( l[i].tokenType == 'OPEN_PAREN' ) openParenthesisStack.push(i);
      if ( l[i].tokenType == 'CLOSE_PAREN' ) removeParenthesesPair(i);

      if ( preceedingTokenCanBeMadeChild(i) ) makeChild(i);

      if ( preceedingTokenCanBeMadeParent(i) ){
        makeParent(i);
        shouldCheckAgain = true;
      }

      if ( shouldCheckAgain ) i--;

    }

    // error if tokenList l is not a single token now
    if (l.length == 1) l = l[0];
    else error.push('string did not resolve to a single tree');

    // error?
    if (error.length > 0) return {error: error.join(',\n'), tree: l};
    // everything fine - token list is now a tree and can be returned
    else return l;

  },


  // ..........................................................
  // ORDERING
  //

  /**
    Takes a string containing an order statement and returns an array
    describing this order for easier processing.
    Called by `parse()`.

    @param {String | Function} orderOp the string containing the order statement, or a comparison function
    @returns {Array | Function} array of order statement, or a function if a function was specified
  */
  buildOrder: function (orderOp) {
    if (!orderOp) {
      return [];
    }
    else if (SC.typeOf(orderOp) === 'function') {
      return orderOp;
    }
    else {
      var o = orderOp.split(',');
      for (var i=0; i < o.length; i++) {
        var p = o[i];
        p = p.replace(/^\s+|\s+$/,'');
        p = p.replace(/\s+/,',');
        p = p.split(',');
        o[i] = {propertyName: p[0]};
        if (p[1] && p[1] == 'DESC') o[i].descending = true;
      }

      return o;
    }

  }

});


// Class Methods
SC.Query.reopenClass( /** @scope SC.Query */ {

  /**
    Constant used for `SC.Query#location`

    @type String
  */
  LOCAL: 'local',

  /**
    Constant used for `SC.Query#location`

    @type String
  */
  REMOTE: 'remote',

  /**
    Given a query, returns the associated `storeKey`.  For the inverse of this
    method see `SC.Store.queryFor()`.

    @param {SC.Query} query the query
    @returns {Number} a storeKey.
  */
  storeKeyFor: function(query) {
    return query ? get(query, 'storeKey') : null;
  },

  /**
    Will find which records match a give `SC.Query` and return an array of
    store keys. This will also apply the sorting for the query.

    @param {SC.Query} query to apply
    @param {SC.RecordArray} records to search within
    @param {SC.Store} store to materialize record from
    @returns {Array} array instance of store keys matching the SC.Query (sorted)
  */
  containsRecords: function(query, records, store) {
    var ret = [];
    for(var idx=0,len=get(records, 'length');idx<len;idx++) {
      var record = records.objectAt(idx);
      if(record && query.contains(record)) {
        ret.push(get(record, 'storeKey'));
      }
    }

    ret = SC.Query.orderStoreKeys(ret, query, store);

    return ret;
  },

  /**
    Sorts a set of store keys according to the orderBy property
    of the `SC.Query`.

    @param {Array} storeKeys to sort
    @param {SC.Query} query to use for sorting
    @param {SC.Store} store to materialize records from
    @returns {Array} sorted store keys.  may be same instance as passed value
  */
  orderStoreKeys: function(storeKeys, query, store) {
    // apply the sort if there is one
    if (storeKeys) {
      var res = storeKeys.sort(function(a, b) {
        return SC.Query.compareStoreKeys(query, store, a, b);
      });
    }

    return storeKeys;
  },

  /**
    Default sort method that is used when calling `containsStoreKeys()`
    or `containsRecords()` on this query. Simply materializes two records
    based on `storekey`s before passing on to `compare()`.

    @param {Number} storeKey1 a store key
    @param {Number} storeKey2 a store key
    @returns {Number} -1 if record1 < record2,  +1 if record1 > record2, 0 if equal
  */
  compareStoreKeys: function(query, store, storeKey1, storeKey2) {
    var record1     = store.materializeRecord(storeKey1),
        record2     = store.materializeRecord(storeKey2);

    return query.compare(record1, record2);
  },

  /**
    Returns a `SC.Query` instance reflecting the passed properties.  Where
    possible this method will return cached query instances so that multiple
    calls to this method will return the same instance.  This is not possible
    however, when you pass custom parameters or set ordering. All returned
    queries are frozen.

    Usually you will not call this method directly.  Instead use the more
    convenient `SC.Query.local()` and `SC.Query.remote()`.

    Examples

    There are a number of different ways you can call this method.

    The following return local queries selecting all records of a particular
    type or types, including any subclasses:

        var people = SC.Query.local(Ab.Person);
        var peopleAndCompanies = SC.Query.local([Ab.Person, Ab.Company]);

        var people = SC.Query.local('Ab.Person');
        var peopleAndCompanies = SC.Query.local('Ab.Person Ab.Company'.w());

        var allRecords = SC.Query.local(SC.Record);

    The following will match a particular type of condition:

        var married = SC.Query.local(Ab.Person, "isMarried=YES");
        var married = SC.Query.local(Ab.Person, "isMarried=%@", [YES]);
        var married = SC.Query.local(Ab.Person, "isMarried={married}", {
          married: YES
        });

    You can also pass a hash of options as the second parameter.  This is
    how you specify an order, for example:

        var orderedPeople = SC.Query.local(Ab.Person, { orderBy: "firstName" });

    @param {String} location the query location.
    @param {SC.Record|Array} recordType the record type or types.
    @param {String} conditions optional conditions
    @param {Hash} params optional params. or pass multiple args.
    @returns {SC.Query}
  */
  build: function(location, recordType, conditions, params) {

    var opts = null,
        ret, cache, key, tmp;

    // fast case for query objects.
    if (recordType && recordType.isQuery) {
      if (get(recordType, 'location') === location) {
        return recordType;
      } else {
        ret = recordType.copy();
        set(ret, 'location', location);
        return ret.freeze();
      }
    }

    // normalize recordType
    if (typeof recordType === 'string') {
      ret = getPath( recordType);
      if (!ret) throw "%@ did not resolve to a class".fmt(recordType);
      recordType = ret ;
    } else if (recordType && recordType.isEnumerable) {
      ret = [];
      recordType.forEach(function(t) {
        if (typeof t === 'string') t = getPath( t);
        if (!t) throw "cannot resolve record types: %@".fmt(recordType);
        ret.push(t);
      }, this);
      recordType = ret ;
    } else if (!recordType) recordType = SC.Record; // find all records

    if (params === undefined) params = null;
    if (conditions === undefined) conditions = null;

    // normalize other params. if conditions is just a hash, treat as opts
    if (!params && (typeof conditions !== 'string')) {
      opts = conditions;
      conditions = null ;
    }

    // special case - easy to cache.
    if (!params && !opts) {

      tmp = SC.Query._scq_recordTypeCache;
      if (!tmp) tmp = SC.Query._scq_recordTypeCache = {};
      cache = tmp[location];
      if (!cache) cache = tmp[location] = {};

      if (recordType.isEnumerable) {
        key = recordType.map(function(k) { return SC.guidFor(k); });
        key = key.sort().join(':');
      } else key = SC.guidFor(recordType);

      if (conditions) key = [key, conditions].join('::');

      ret = cache[key];
      if (!ret) {
        if (recordType.isEnumerable) {
          opts = { recordTypes: recordType.copy() };
        } else opts = { recordType: recordType };

        opts.location = location ;
        opts.conditions = conditions ;
        ret = cache[key] = SC.Query.create(opts).freeze();
      }
    // otherwise parse extra conditions and handle them
    } else {

      if (!opts) opts = {};
      if (!opts.location) opts.location = location ; // allow override

      // pass one or more recordTypes.
      if (recordType && recordType.isEnumerable) {
        opts.recordsTypes = recordType;
      } else opts.recordType = recordType;

      // set conditions and params if needed
      if (conditions) opts.conditions = conditions;
      if (params) opts.parameters = params;

      ret = SC.Query.create(opts).freeze();
    }

    return ret ;
  },

  /**
    Returns a `LOCAL` query with the passed options.  For a full description of
    the parameters you can pass to this method, see `SC.Query.build()`.

    @param {SC.Record|Array} recordType the record type or types.
    @param {String} conditions optional conditions
    @param {Hash} params optional params. or pass multiple args.
    @returns {SC.Query}
  */
  local: function(recordType, conditions, params) {
    return this.build(SC.Query.LOCAL, recordType, conditions, params);
  },

  /**
    Returns a `REMOTE` query with the passed options.  For a full description of
    the parameters you can pass to this method, see `SC.Query.build()`.

    @param {SC.Record|Array} recordType the record type or types.
    @param {String} conditions optional conditions
    @param {Hash} params optional params. or pass multiple args.
    @returns {SC.Query}
  */
  remote: function(recordType, conditions, params) {
    return this.build(SC.Query.REMOTE, recordType, conditions, params);
  },

  /** @private
    called by `SC.Record.extend()`. invalidates `expandedRecordTypes`
  */
  _scq_didDefineRecordType: function() {
    var q = SC.Query._scq_queriesWithExpandedRecordTypes;
    if (q) {
      q.forEach(function(query) {
        SC.propertyWillChange(query, 'expandedRecordTypes');
        SC.propertyDidChange(query, 'expandedRecordTypes');
      }, this);
      q.clear();
    }
  }

});


/** @private
  Hash of registered comparisons by propery name.
*/
SC.Query.comparisons = {};

/**
  Call to register a comparison for a specific property name.
  The function you pass should accept two values of this property
  and return -1 if the first is smaller than the second,
  0 if they are equal and 1 if the first is greater than the second.

  @param {String} name of the record property
  @param {Function} custom comparison function
  @returns {SC.Query} receiver
*/
SC.Query.registerComparison = function(propertyName, comparison) {
  SC.Query.comparisons[propertyName] = comparison;
};


/**
  Call to register an extension for the query language.
  You shoud provide a name for your extension and a definition
  specifying how it should be parsed and evaluated.

  Have a look at `queryLanguage` for examples of definitions.

  TODO add better documentation here

  @param {String} tokenName name of the operator
  @param {Object} token extension definition
  @returns {SC.Query} receiver
*/
SC.Query.registerQueryExtension = function(tokenName, token) {
  get(SC.Query, 'proto').queryLanguage[tokenName] = token;
};


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
// @global SC

var get = SC.get, set = SC.set;

/**
  @class

  An error, used to represent an error state.

  Many API's within SproutCore will return an instance of this object whenever
  they have an error occur.  An error includes an error code, description,
  and optional human readable label that indicates the item that failed.

  Depending on the error, other properties may also be added to the object
  to help you recover from the failure.

  You can pass error objects to various UI elements to display the error in
  the interface. You can easily determine if the value returned by some API is
  an error or not using the helper SC.ok(value).

  Faking Error Objects
  ---

  You can actually make any object you want to be treated like an Error object
  by simply implementing two properties: isError and errorValue.  If you
  set isError to YES, then calling SC.ok(obj) on your object will return NO.
  If isError is YES, then SC.val(obj) will return your errorValue property
  instead of the receiver.

  @extends SC.Object
  @since SproutCore 1.0
*/
SC.StoreError = SC.Object.extend(
/** @scope SC.StoreError.prototype */ {

  /**
    error code.  Used to designate the error type.

    @type Number
  */
  code: -1,

  /**
    Human readable description of the error.  This can also be a non-localized
    key.

    @type String
  */
  message: '',

  /**
    The value the error represents.  This is used when wrapping a value inside
    of an error to represent the validation failure.

    @type Object
  */
  errorValue: null,

  /**
    The original error object.  Normally this will return the receiver.
    However, sometimes another object will masquarade as an error; this gives
    you a way to get at the underyling error.

    @type SC.StoreError
  */
  errorObject: function() {
    return this;
  }.property().cacheable(),

  /**
    Human readable name of the item with the error.

    @type String
  */
  label: null,

  /** @private */
  toString: function() {
    return "SC.StoreError:%@:%@ (%@)".fmt(SC.guidFor(this), get(this, 'message'), get(this, 'code'));
  },

  /**
    Walk like a duck.

    @type Boolean
  */
  isError: YES
}) ;

/**
  Creates a new SC.StoreError instance with the passed description, label, and
  code.  All parameters are optional.

  @param description {String} human readable description of the error
  @param label {String} human readable name of the item with the error
  @param code {Number} an error code to use for testing.
  @returns {SC.StoreError} new error instance.
*/
SC.StoreError.desc = function(description, label, value, code) {
  var opts = { message: description } ;
  if (label !== undefined) opts.label = label ;
  if (code !== undefined) opts.code = code ;
  if (value !== undefined) opts.errorValue = value ;
  return this.create(opts) ;
} ;

/**
  Shorthand form of the SC.StoreError.desc method.

  @param description {String} human readable description of the error
  @param label {String} human readable name of the item with the error
  @param code {Number} an error code to use for testing.
  @returns {SC.StoreError} new error instance.
*/

SC.$error = function(description, label, value, c) {
  return SC.StoreError.desc(description,label, value, c);
} ;

/**
  Returns NO if the passed value is an error object or false.

  @param {Object} ret object value
  @returns {Boolean}
*/
SC.ok = function(ret) {
  return (ret !== false) && !(ret && ret.isError);
};

/** @private */
SC.$ok = SC.ok;

/**
  Returns the value of an object.  If the passed object is an error, returns
  the value associated with the error; otherwise returns the receiver itself.

  @param {Object} obj the object
  @returns {Object} value
*/
SC.val = function(obj) {
  if (obj && obj.isError) {
    return get(obj, 'errorValue') ; // Error has no value
  } else return obj ;
};

/** @private */
SC.$val = SC.val;

// STANDARD ERROR OBJECTS

/**
  Standard error code for errors that do not support multiple values.

  @type Number
*/
SC.StoreError.HAS_MULTIPLE_VALUES = -100 ;


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



var get = SC.get, set = SC.set, none = SC.none, copy = SC.copy, K;

/**
  @class

  A Record is the core model class in SproutCore. It is analogous to
  NSManagedObject in Core Data and EOEnterpriseObject in the Enterprise
  Objects Framework (aka WebObjects), or ActiveRecord::Base in Rails.

  To create a new model class, in your SproutCore workspace, do:

      $ sc-gen model MyApp.MyModel

  This will create MyApp.MyModel in clients/my_app/models/my_model.js.

  The core attributes hash is used to store the values of a record in a
  format that can be easily passed to/from the server.  The values should
  generally be stored in their raw string form.  References to external
  records should be stored as primary keys.

  Normally you do not need to work with the attributes hash directly.
  Instead you should use get/set on normal record properties.  If the
  property is not defined on the object, then the record will check the
  attributes hash instead.

  You can bulk update attributes from the server using the
  `updateAttributes()` method.

  @extends SC.Object
  @see SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.Record = SC.Object.extend(
/** @scope SC.Record.prototype */ {

  /**
    Deprecated.  Use instanceof keyword instead.

    @deprecated
    @type Boolean
    @default YES
  */
  isRecord: YES,

  /**
    If you have nested records

    @type Boolean
    @default NO
  */
  isParentRecord: NO,

  // ...............................
  // PROPERTIES
  //

  /**
    This is the primary key used to distinguish records.  If the keys
    match, the records are assumed to be identical.

    @type String
    @default 'guid'
  */
  primaryKey: 'guid',

  /**
    Returns the id for the record instance.  The id is used to uniquely
    identify this record instance from all others of the same type.  If you
    have a `primaryKey set on this class, then the id will be the value of the
    `primaryKey` property on the underlying JSON hash.

    @type String
    @property
    @dependsOn storeKey
  */
  id: function(key, value) {
    if (value !== undefined) {
      this.writeAttribute(get(this, 'primaryKey'), value);
      return value;
    } else {
      return SC.Store.idFor(get(this, 'storeKey'));
    }
  }.property('storeKey').cacheable(),

  /**
    All records generally have a life cycle as they are created or loaded into
    memory, modified, committed and finally destroyed.  This life cycle is
    managed by the status property on your record.

    The status of a record is modelled as a finite state machine.  Based on the
    current state of the record, you can determine which operations are
    currently allowed on the record and which are not.

    In general, a record can be in one of five primary states:
    `SC.Record.EMPTY`, `SC.Record.BUSY`, `SC.Record.READY`,
    `SC.Record.DESTROYED`, `SC.Record.ERROR`.  These are all described in
    more detail in the class mixin (below) where they are defined.

    @type Number
    @property
    @dependsOn storeKey
  */
  status: function() {
    return this.store.readStatus(get(this, 'storeKey'));
  }.property('storeKey').cacheable(),

  /**
    The store that owns this record.  All changes will be buffered into this
    store and committed to the rest of the store chain through here.

    This property is set when the record instance is created and should not be
    changed or else it will break the record behavior.

    @type SC.Store
    @default null
  */
  store: null,

  /**
    This is the store key for the record, it is used to link it back to the
    dataHash. If a record is reused, this value will be replaced.

    You should not edit this store key but you may sometimes need to refer to
    this store key when implementing a Server object.

    @type Number
    @default null
  */
  storeKey: null,

  /**
    YES when the record has been destroyed

    @type Boolean
    @property
    @dependsOn status
  */
  isDestroyed: function() {
    return !!(get(this, 'status') & SC.Record.DESTROYED);
  }.property('status').cacheable(),

  /**
    `YES` when the record is in an editable state.  You can use this property
    to quickly determine whether attempting to modify the record would raise
    an exception.

    This property is both readable and writable.  Note however that if you
    set this property to `YES` but the status of the record is anything but
    `SC.Record.READY`, the return value of this property may remain `NO`.

    @type Boolean
    @property
    @dependsOn status
  */
  isEditable: function(key, value) {
    if (value !== undefined) this._screc_isEditable = value;
    return (get(this, 'status') & SC.Record.READY) && this._screc_isEditable;
  }.property('status').cacheable(),

  /**
    @private

    Backing value for isEditable
  */
  _screc_isEditable: YES, // default

  /**
    `YES` when the record's contents have been loaded for the first time.  You
    can use this to quickly determine if the record is ready to display.

    @type Boolean
    @property
    @dependsOn status
  */
  isLoaded: function() {
    var status = get(this, 'status');
    return !((status===K.EMPTY) || (status===K.BUSY_LOADING) || (status===K.ERROR));
  }.property('status').cacheable(),

  /**
    If set, this should be an array of active relationship objects that need
    to be notified whenever the underlying record properties change.
    Currently this is only used by toMany relationships, but you could
    possibly patch into this yourself also if you are building your own
    relationships.

    @type Array
    @default null
  */
  relationships: null,

  /**
    This will return the raw attributes that you can edit directly.  If you
    make changes to this hash, be sure to call `beginEditing()` before you get
    the attributes and `endEditing()` afterwards.

    @type Hash
    @property
  **/
  attributes: function() {
    return get(this, 'store').readEditableDataHash(get(this, 'storeKey'));
  }.property(),

  /**
    This will return the raw attributes that you cannot edit directly.  It is
    useful if you want to efficiently look at multiple attributes in bulk.  If
    you would like to edit the attributes, see the `attributes` property
    instead.

    @type Hash
    @property
  **/
  readOnlyAttributes: function() {
    var ret = get(this, 'store').readDataHash(get(this, 'storeKey'));
    return ret ? copy(ret) : null;
  }.property(),

  /**
    The namespace which to retrieve the childRecord Types from

    @type String
    @default null
  */
  nestedRecordNamespace: null,

  /**
    Whether or not this is a nested Record.

    @type Boolean
    @property
  */
  isNestedRecord: function(){
    var store = get(this, 'store'), sk = get(this, 'storeKey');
    return !!store.parentStoreKeyExists(sk);
  }.property('storeKey').cacheable(),

  /**
    The parent record if this is a nested record.

    @type Boolean
    @property
  */
  parentRecord: function(){
    var sk = get(this, 'storeKey'), store = get(this, 'store');
    return store.materializeParentRecord(sk);
  }.property('storeKey').cacheable(),

  // ...............................
  // CRUD OPERATIONS
  //

  /**
    Refresh the record from the persistent store.  If the record was loaded
    from a persistent store, then the store will be asked to reload the
    record data from the server.  If the record is new and exists only in
    memory then this call will have no effect.

    @param {boolean} recordOnly
      optional param if you want to only this record even if it is a child
      record.

    @param {Function} callback
      optional callback that will fire when request finishes

    @returns {SC.Record} receiver
  */
  refresh: function(recordOnly, callback) {
    var store = get(this, 'store'), rec, ro,
        sk = get(this, 'storeKey'),
        prKey = store.parentStoreKeyExists();

    if (!callback && 'function'===typeof recordOnly) {
      callback = recordOnly;
      recordOnly =  false;
    }

    // If we only want to refresh this record or it doesn't have a parent
    // record we will commit this record
    if (recordOnly || (none(recordOnly) && none(prKey))) {
      store.refreshRecord(null, null, sk, callback);
    } else if (prKey) {
      rec = store.materializeRecord(prKey);
      rec.refresh(false, callback);
    }

    return this ;
  },

  /**
    Deletes the record along with any dependent records.  This will mark the
    records destroyed in the store as well as changing the isDestroyed
    property on the record to YES.  If this is a new record, this will avoid
    creating the record in the first place.

    @param {boolean} recordOnly
      optional param if you want to only THIS record even if it is a child
      record.

    @returns {SC.Record} receiver
  */
  destroy: function(recordOnly) {
    var store = get(this, 'store'), rec, ro,
        sk = get(this, 'storeKey'),
        prKey = store.parentStoreKeyExists();

    // If we only want to destroy this record or it doesn't have a parent
    // record we will commit this record
    ro = recordOnly || (none(recordOnly) && none(prKey));
    if (ro){
      SC.propertyWillChange(this, 'status');
      store.destroyRecord(null, null, sk);
      SC.propertyDidChange(this, 'status');

      // If there are any aggregate records, we might need to propagate our
      // new status to them.
      this.propagateToAggregates();

    } else if (prKey){
      rec = store.materializeRecord(prKey);
      rec.destroy(false);
    }

    return this ;
  },

  /**
    You can invoke this method anytime you need to make the record as dirty.
    This will cause the record to be commited when you `commitChanges()`
    on the underlying store.

    If you use the `writeAttribute()` primitive, this method will be called
    for you.

    If you pass the key that changed it will ensure that observers are fired
    only once for the changed property instead of `allPropertiesDidChange()`

    @param {String} key key that changed (optional)
    @returns {SC.Record} receiver
  */
  recordDidChange: function(key) {

    // If we have a parent, they changed too!
    var p = get(this, 'parentRecord');
    if (p) p.recordDidChange();

    get(this, 'store').recordDidChange(null, null, get(this, 'storeKey'), key);
    this.notifyPropertyChange('status');

    // If there are any aggregate records, we might need to propagate our new
    // status to them.
    this.propagateToAggregates();

    return this ;
  },

  // ...............................
  // ATTRIBUTES
  //

  /** @private
    Current edit level.  Used to defer editing changes.
  */
  _editLevel: 0 ,

  /**
    Defers notification of record changes until you call a matching
    `endEditing()` method.  This method is called automatically whenever you
    set an attribute, but you can call it yourself to group multiple changes.

    Calls to `beginEditing()` and `endEditing()` can be nested.

    @returns {SC.Record} receiver
  */
  beginEditing: function() {
    this._editLevel++;
    return this ;
  },

  /**
    Notifies the store of record changes if this matches a top level call to
    `beginEditing()`.  This method is called automatically whenever you set an
    attribute, but you can call it yourself to group multiple changes.

    Calls to `beginEditing()` and `endEditing()` can be nested.

    @param {String} key key that changed (optional)
    @returns {SC.Record} receiver
  */
  endEditing: function(key) {
    if(--this._editLevel <= 0) {
      this._editLevel = 0;
      this.recordDidChange(key);
    }
    return this ;
  },

  /**
    Reads the raw attribute from the underlying data hash.  This method does
    not transform the underlying attribute at all.

    @param {String} key the attribute you want to read
    @returns {Object} the value of the key, or undefined if it doesn't exist
  */
  readAttribute: function(key) {
    var store = get(this, 'store'), storeKey = get(this, 'storeKey');
    var attrs = store.readDataHash(storeKey);
    return attrs ? attrs[key] : undefined ;
  },

  /**
    Updates the passed attribute with the new value.  This method does not
    transform the value at all.  If instead you want to modify an array or
    hash already defined on the underlying json, you should instead get
    an editable version of the attribute using `editableAttribute()`.

    @param {String} key the attribute you want to read
    @param {Object} value the value you want to write
    @param {Boolean} ignoreDidChange only set if you do NOT want to flag
      record as dirty
    @returns {SC.Record} receiver
  */
  writeAttribute: function(key, value, ignoreDidChange) {
    var store    = get(this, 'store'),
        storeKey = get(this, 'storeKey'),
        attrs;

    attrs = store.readEditableDataHash(storeKey);
    if (!attrs) throw K.BAD_STATE_ERROR;

    // if value is the same, do not flag record as dirty
    if (value !== attrs[key]) {
      if(!ignoreDidChange) this.beginEditing();
      attrs[key] = value;

      // If the key is the primaryKey of the record, we need to tell the store
      // about the change.
      if (key===get(this, 'primaryKey')) {
        SC.propertyWillChange(this, 'id'); // Reset computed value
        SC.Store.replaceIdFor(storeKey, value) ;
        SC.propertyDidChange(this, 'id'); // Reset computed value
      }

      if(!ignoreDidChange) this.endEditing(key);
    }
    return this ;
  },

  /**
    This will also ensure that any aggregate records are also marked dirty
    if this record changes.

    Should not have to be called manually.
  */
  propagateToAggregates: function() {
    var storeKey = get(this, 'storeKey'),
        recordType = SC.Store.recordTypeFor(storeKey),
        idx, len, key, val, recs, aggregates;

    aggregates = recordType.aggregates;

    // if recordType aggregates are not set up yet, make sure to
    // create the cache first
    if (!aggregates) {
      var dataHash = get(this, 'store').readDataHash(storeKey);
      var attrFor  = SC.RecordAttribute.attrFor;
      var attr;

      aggregates = [];
      for(var k in dataHash) {
        attr = attrFor(this, k);
        if (attr && get(attr, 'aggregate')) aggregates.push(k);
      }
      recordType.aggregates = aggregates;
    }

    // now loop through all aggregate properties and mark their related
    // record objects as dirty
    var K          = SC.Record,
        dirty      = K.DIRTY,
        readyNew   = K.READY_NEW,
        destroyed  = K.DESTROYED,
        readyClean = K.READY_CLEAN,
        iter;

    /**
      @private

      If the child is dirty, then make sure the parent gets a dirty
      status.  (If the child is created or destroyed, there's no need,
      because the parent will dirty itself when it modifies that
      relationship.)

      @param {SC.Record} record to propagate to
    */
    iter =  function(rec) {
      var childStatus, parentStatus;

      if (rec) {
        childStatus = get(this, 'status');
        if ((childStatus & dirty)  ||
            (childStatus & readyNew)  ||  (childStatus & destroyed)) {
          parentStatus = get(rec, 'status');
          if (parentStatus === readyClean) {
            // Note:  storeDidChangeProperties() won't put it in the
            //        changelog!
            get(rec, 'store').recordDidChange(get(rec, 'constructor'), null, get(rec, 'storeKey'), null, YES);
          }
        }
      }
    };

    for(idx=0,len=aggregates.length;idx<len;++idx) {
      key = aggregates[idx];
      val = get(this, key);
      recs = val instanceof SC.ManyArray ? val : [val];
      recs.forEach(iter, this);
    }
  },

  /** @private used internally to notify of property changes. */
  notifyPropertyChange: function(keyName) {
    SC.propertyWillChange(this, keyName);
    SC.propertyDidChange(this, keyName);
  },

  /**
    Called by the store whenever the underlying data hash has changed.  This
    will notify any observers interested in data hash properties that they
    have changed.

    @param {Boolean} statusOnly changed
    @param {String} key that changed (optional)
    @returns {SC.Record} receiver
  */
  storeDidChangeProperties: function(statusOnly, keys) {
    // TODO:  Should this function call propagateToAggregates() at the
    //        appropriate times?
    if (statusOnly) {
      this.notifyPropertyChange('status');
    } else {
      if (!keys) {
        keys = get(this, 'store').readDataHash(get(this, 'storeKey'));
        if (keys) keys = SC.keys(keys);
      }

      SC.beginPropertyChanges(this);
      if (keys) {
        keys.forEach(function(k) {
          this.notifyPropertyChange(k);
        }, this);
      }
      this.notifyPropertyChange('status');
      SC.endPropertyChanges(this);

      // also notify manyArrays
      var manyArrays = this.relationships,
          loc        = manyArrays ? manyArrays.length : 0 ;
      while(--loc>=0) manyArrays[loc].recordPropertyDidChange(keys);
    }
  },

  /**
    Normalizing a record will ensure that the underlying hash conforms
    to the record attributes such as their types (transforms) and default
    values.

    This method will write the conforming hash to the store and return
    the materialized record.

    By normalizing the record, you can use the `attributes` property and be
    assured that it will conform to the defined model. For example, this
    can be useful in the case where you need to send a JSON representation
    to some server after you have used `.createRecord()`, since this method
    will enforce the 'rules' in the model such as their types and default
    values. You can also include null values in the hash with the
    includeNull argument.

    @param {Boolean} includeNull will write empty (null) attributes
    @returns {SC.Record} the normalized record
  */

  normalize: function(includeNull) {
    var primaryKey = this.primaryKey,
        recordId   = get(this, 'id'),
        store      = get(this, 'store'),
        storeKey   = get(this, 'storeKey'),
        key, typeClass, recHash, attrValue, normChild,  isRecord,
        isChild, defaultVal, keyForDataHash, attr;

    var dataHash = store.readEditableDataHash(storeKey) || {};
    dataHash[primaryKey] = recordId;
    recHash = store.readDataHash(storeKey);

    var attrFor = SC.RecordAttribute.attrFor;

    for (key in this) {
      // make sure property is a record attribute.
      attr = attrFor(this, key);
      if (attr) {
        keyForDataHash = get(attr, 'key') || key; // handle alt keys
        typeClass = get(attr, 'typeClass');
        isRecord  = SC.typeOf(get(attr, 'typeClass')) === 'class';
        isChild   = get(attr, 'isNestedRecordTransform');

        if (isRecord) {
          attrValue = recHash[keyForDataHash];
          if (attrValue !== undefined) {
            // write value already there
            dataHash[keyForDataHash] = attrValue;
          } else {
            // or write default
            defaultVal = get(attr, 'defaultValue');

            // computed default value
            if ('function' === typeof defaultVal) {
              dataHash[keyForDataHash] = defaultVal(this, key, defaultVal);
            } else {
              // plain value
              dataHash[keyForDataHash] = defaultVal;
            }
          }
        } else if (isChild) {
          attrValue = get(this, key);

          // Sometimes a child attribute property does not refer to a
          // child record. Catch this and don't try to normalize.
          if (attrValue && attrValue.normalize) {
            attrValue.normalize();
          }

        } else {
          attrValue = get(this, key);
          if (attrValue!==undefined || (attrValue===null && includeNull)) {
            attrValue = attr.fromType(this, key, attrValue);
            dataHash[keyForDataHash] = attrValue;
          }
        }
      }
    }

    return this;
  },


  setUnknownProperty: function(key, value) {
    // If the value is undefined, it means it has not been set to null
    // by SC.Record (and thus reserved as an internal property).
    //
    // Since we will always circumvent the normal set() semantics in
    // this case, the value will *never* be set, so every call to
    // `set` with this key will go through `unknownProperty` and proxy
    // the change to the data hash.
    if (this[key] === undefined) {
      // first check if we should ignore unknown properties for this
      // recordType
      var storeKey = get(this, 'storeKey'),
        recordType = SC.Store.recordTypeFor(storeKey);

      if(recordType.ignoreUnknownProperties===YES) {
        this[key] = value;
        return value;
      }

      // if we're modifying the PKEY, then `SC.Store` needs to relocate where
      // this record is cached. store the old key, update the value, then let
      // the store do the housekeeping...
      var primaryKey = get(this, 'primaryKey');
      this.writeAttribute(key,value);

      // update ID if needed
      if (key === primaryKey) {
        SC.Store.replaceIdFor(storeKey, value);
      }

      return this.unknownProperty(key);
    } else {
      // This is an internal reserved property. Do the normal `set` behavior.
      return this._super(key, value);
    }
  },

  /**
    If you try to get/set a property not defined by the record, then this
    method will be called. It will try to get the value from the set of
    attributes.

    This will also check is `ignoreUnknownProperties` is set on the recordType
    so that they will not be written to `dataHash` unless explicitly defined
    in the model schema.

    @param {String} key the attribute being get/set
    @param {Object} value the value to set the key to, if present
    @returns {Object} the value
  */
  unknownProperty: function(key) {
    return this.readAttribute(key);
  },

  /**
    Lets you commit this specific record to the store which will trigger
    the appropriate methods in the data source for you.

    @param {Hash} params optional additonal params that will passed down
      to the data source
    @param {boolean} recordOnly optional param if you want to only commit a single
      record if it has a parent.
    @param {Function} callback optional callback that the store will fire once the
    datasource finished committing
    @returns {SC.Record} receiver
  */
  commitRecord: function(params, recordOnly, callback) {
    var store = get(this, 'store'), rec, ro,
        sk = get(this, 'storeKey'),
        prKey = store.parentStoreKeyExists();

    // If we only want to commit this record or it doesn't have a parent record
    // we will commit this record
    ro = recordOnly || (SC.none(recordOnly) && SC.none(prKey));
    if (ro){
      store.commitRecord(undefined, undefined, get(this, 'storeKey'), params, callback);
    } else if (prKey){
      rec = store.materializeRecord(prKey);
      rec.commitRecord(params, recordOnly, callback);
    }
    return this ;
  },

  // ..........................................................
  // EMULATE SC.StoreError API
  //

  /**
    Returns `YES` whenever the status is SC.Record.ERROR.  This will allow you
    to put the UI into an error state.

    @type Boolean
    @property
    @dependsOn status
  */
  isError: function() {
    return get(this, 'status') & SC.Record.ERROR;
  }.property('status').cacheable(),

  /**
    Returns the receiver if the record is in an error state.  Returns null
    otherwise.

    @type SC.Record
    @property
    @dependsOn isError
  */
  errorValue: function() {
    return get(this, 'isError') ? SC.val(get(this, 'errorObject')) : null ;
  }.property('isError').cacheable(),

  /**
    Returns the current error object only if the record is in an error state.
    If no explicit error object has been set, returns SC.Record.GENERIC_ERROR.

    @type SC.StoreError
    @property
    @dependsOn isError
  */
  errorObject: function() {
    if (get(this, 'isError')) {
      var store = get(this, 'store');
      return store.readError(get(this, 'storeKey')) || K.GENERIC_ERROR;
    } else return null ;
  }.property('isError').cacheable(),

  // ...............................
  // PRIVATE
  //

  /** @private
    Sets the key equal to value.

    This version will first check to see if the property is an
    `SC.RecordAttribute`, and if so, will ensure that its isEditable property
    is `YES` before attempting to change the value.

    @param key {String} the property to set
    @param value {Object} the value to set or null.
    @returns {SC.Record}
  */
  set: function(key, value) {
    var func = this[key];

    if (func && func.isProperty && !get(func, 'isEditable')) {
      return this;
    }
    return this._super(key, value);
  },

  /** @private
    Creates string representation of record, with status.

    @returns {String}
  */

  toString: function() {
    // We won't use 'readOnlyAttributes' here because accessing them directly
    // avoids a SC.copy() -- we'll be careful not to edit anything.
    var attrs = get(this, 'store').readDataHash(get(this, 'storeKey'));
    return "%@(%@) %@".fmt(this.constructor.toString(), SC.inspect(attrs), this.statusString());
  },

  /** @private
    Creates string representation of record, with status.

    @returns {String}
  */

  statusString: function() {
    var ret = [], status = get(this, 'status');

    for(var prop in SC.Record) {
      if(prop.match(/[A-Z_]$/) && SC.Record[prop]===status) {
        ret.push(prop);
      }
    }

    return ret.join(" ");
  },

  /**
    Registers a child record with this parent record.

    If the parent already knows about the child record, return the cached
    instance. If not, create the child record instance and add it to the child
    record cache.

    @param {Hash} value The hash of attributes to apply to the child record.
    @param {Integer} key The store key that we are asking for
    @param {String} path The property path of the child record
    @returns {SC.Record} the child record that was registered
   */
  registerNestedRecord: function(value, key, path) {
    var store, psk, csk, childRecord, recordType;

    // if no path is entered it must be the key
    if (SC.none(path)) path = key;

    // if a record instance is passed, simply use the storeKey.  This allows
    // you to pass a record from a chained store to get the same record in the
    // current store.
    if (value instanceof SC.Record) {
      childRecord = value;
    } else {
      recordType = this._materializeNestedRecordType(value, key);
      childRecord = this.createNestedRecord(recordType, value);
    }

    if (childRecord){
      set(this, 'isParentRecord', YES);
      store = get(this, 'store');
      psk = get(this, 'storeKey');
      csk = get(childRecord, 'storeKey');
      store.registerChildToParent(psk, csk, path);
    }

    return childRecord;
  },

  /**
    @private

     private method that retrieves the `recordType` from the hash that is
     provided.

     Important for use in polymorphism but you must have the following items
     in the parent record:

     `nestedRecordNamespace` <= this is the object that has the `SC.Records`
     defined

     @param {Hash} value The hash of attributes to apply to the child record.
     @param {String} key the name of the key on the attribute
     @param {SC.Record} the record that was materialized
    */
  _materializeNestedRecordType: function(value, key){
    var childNS, recordType, ret, attr, t;

    // Get the record type, first checking the "type" property on the hash.
    t = SC.typeOf(value);
    if (t === 'instance' || t === 'object') {
      // Get the record type.
      childNS = get(this, 'nestedRecordNamespace');
      if (get(value, 'type') && !SC.none(childNS)) {
        recordType = get(childNS, get(value, 'type'));
      }
    }

    // Maybe it's not a hash or there was no type property.
    if (!recordType && key) {
      attr = SC.RecordAttribute.attrFor(this, key);
      if (attr) recordType = get(attr, 'typeClass');
    }

    // When all else fails throw and exception.
    if (!SC.Record.detect(recordType)) {
      throw 'SC.Child: Error during transform: Invalid record type.';
    }

    return recordType;
  },

  /**
    Creates a new nested record instance.

    @param {SC.Record} recordType The type of the nested record to create.
    @param {Hash} hash The hash of attributes to apply to the child record.
    (may be null)
    @returns {SC.Record} the nested record created
   */
  createNestedRecord: function(recordType, hash) {
    var store, id, sk, pk, cr = null, existingId = null;
    SC.run(this, function() {
      hash = hash || {}; // init if needed

      existingId = hash[get(recordType, 'proto').primaryKey];

      store = get(this, 'store');
      if (SC.none(store)) throw 'Error: during the creation of a child record: NO STORE ON PARENT!';

      if (!id && (pk = get(recordType, 'proto').primaryKey)) {
        id = hash[pk];
        // In case there isnt a primary key supplied then we create on
        // on the fly
        sk = id ? store.storeKeyExists(recordType, id) : null;
        if (sk){
          store.writeDataHash(sk, hash);
          cr = store.materializeRecord(sk);
        } else {
          cr = store.createRecord(recordType, hash) ;
          if (SC.none(id)){
            sk = get(cr, 'storeKey');
            id = 'cr'+sk;
            SC.Store.replaceIdFor(sk, id);
            hash = store.readEditableDataHash(sk);
            hash[pk] = id;
          }
        }

      }

      // ID processing if necessary
      if (SC.none(existingId) && this.generateIdForChild) this.generateIdForChild(cr);

    });

    return cr;
  },

  _nestedRecordKey: 0,

  /**
    Override this function if you want to have a special way of creating
    ids for your child records

    @param {SC.Record} childRecord
    @returns {String} the id generated
   */
  generateIdForChild: function(childRecord){}

}) ;

// Class Methods
SC.Record.reopenClass( /** @scope SC.Record.prototype */ {

  /**
    Whether to ignore unknown properties when they are being set on the record
    object. This is useful if you want to strictly enforce the model schema
    and not allow dynamically expanding it by setting new unknown properties

    @static
    @type Boolean
    @default NO
  */
  ignoreUnknownProperties: NO,

  // ..........................................................
  // CONSTANTS
  //

  /**
    Generic state for records with no local changes.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0001
  */
  CLEAN:            0x0001, // 1

  /**
    Generic state for records with local changes.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0002
  */
  DIRTY:            0x0002, // 2

  /**
    State for records that are still loaded.

    A record instance should never be in this state.  You will only run into
    it when working with the low-level data hash API on `SC.Store`. Use a
    logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0100
  */
  EMPTY:            0x0100, // 256

  /**
    State for records in an error state.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x1000
  */
  ERROR:            0x1000, // 4096

  /**
    Generic state for records that are loaded and ready for use

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0200
  */
  READY:            0x0200, // 512

  /**
    State for records that are loaded and ready for use with no local changes

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0201
  */
  READY_CLEAN:      0x0201, // 513


  /**
    State for records that are loaded and ready for use with local changes

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0202
  */
  READY_DIRTY:      0x0202, // 514


  /**
    State for records that are new - not yet committed to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0203
  */
  READY_NEW:        0x0203, // 515


  /**
    Generic state for records that have been destroyed

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0400
  */
  DESTROYED:        0x0400, // 1024


  /**
    State for records that have been destroyed and committed to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0401
  */
  DESTROYED_CLEAN:  0x0401, // 1025


  /**
    State for records that have been destroyed but not yet committed to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0402
  */
  DESTROYED_DIRTY:  0x0402, // 1026


  /**
    Generic state for records that have been submitted to data source

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0800
  */
  BUSY:             0x0800, // 2048


  /**
    State for records that are still loading data from the server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0804
  */
  BUSY_LOADING:     0x0804, // 2052


  /**
    State for new records that were created and submitted to the server;
    waiting on response from server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0808
  */
  BUSY_CREATING:    0x0808, // 2056


  /**
    State for records that have been modified and submitted to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0810
  */
  BUSY_COMMITTING:  0x0810, // 2064


  /**
    State for records that have requested a refresh from the server.

    Use a logical AND (single `&`) to test record status.

    @static
    @constant
    @type Number
    @default 0x0820
  */
  BUSY_REFRESH:     0x0820, // 2080


  /**
    State for records that have requested a refresh from the server.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0821
  */
  BUSY_REFRESH_CLEAN:  0x0821, // 2081

  /**
    State for records that have requested a refresh from the server.

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0822
  */
  BUSY_REFRESH_DIRTY:  0x0822, // 2082

  /**
    State for records that have been destroyed and submitted to server

    Use a logical AND (single `&`) to test record status

    @static
    @constant
    @type Number
    @default 0x0840
  */
  BUSY_DESTROYING:  0x0840, // 2112


  // ..........................................................
  // ERRORS
  //

  /**
    Error for when you try to modify a record while it is in a bad
    state.

    @static
    @constant
    @type SC.StoreError
  */
  BAD_STATE_ERROR:     SC.$error("Internal Inconsistency"),

  /**
    Error for when you try to create a new record that already exists.

    @static
    @constant
    @type SC.StoreError
  */
  RECORD_EXISTS_ERROR: SC.$error("Record Exists"),

  /**
    Error for when you attempt to locate a record that is not found

    @static
    @constant
    @type SC.StoreError
  */
  NOT_FOUND_ERROR:     SC.$error("Not found "),

  /**
    Error for when you try to modify a record that is currently busy

    @static
    @constant
    @type SC.StoreError
  */
  BUSY_ERROR:          SC.$error("Busy"),

  /**
    Generic unknown record error

    @static
    @constant
    @type SC.StoreError
  */
  GENERIC_ERROR:       SC.$error("Generic Error"),

  /**
    @private
    The next child key to allocate.  A nextChildKey must always be greater than 0.
  */
  _nextChildKey: 0,

  // ..........................................................
  // CLASS METHODS
  //

  /**
    Helper method returns a new `SC.RecordAttribute` instance to map a simple
    value or to-one relationship and then defines it as a computed property.
    At the very least, you should pass the type class you expect the attribute
    to have.  You may pass any additional options as well.

    Use this helper when you define SC.Record subclasses.

        MyApp.Contact = SC.Record.extend({
          firstName: SC.Record.attr(String, { isRequired: YES })
        });

    @param {Class} type the attribute type
    @param {Hash} opts the options for the attribute
    @returns {SC.RecordAttribute} created instance
  */
  attr: function(type, opts) {
    return SC.RecordAttribute.attr(type, opts).computed();
  },

  /**
    Returns an `SC.RecordAttribute` that describes a fetched attribute.  When
    you reference this attribute, it will return an `SC.RecordArray` that uses
    the type as the fetch key and passes the attribute value as a param.

    Use this helper when you define SC.Record subclasses.

        MyApp.Group = SC.Record.extend({
          contacts: SC.Record.fetch('MyApp.Contact')
        });

    @param {SC.Record|String} recordType The type of records to load
    @param {Hash} opts the options for the attribute
    @returns {SC.RecordAttribute} created instance
  */
  fetch: function(recordType, opts) {
    return SC.FetchedAttribute.attr(recordType, opts).computed();
  },

  /**
    Will return one of the following:

     1. `SC.ManyAttribute` that describes a record array backed by an
        array of guids stored in the underlying JSON.
     2. `SC.ChildrenAttribute` that describes a record array backed by a
        array of hashes.

    You can edit the contents of this relationship.

    For `SC.ManyAttribute`, If you set the inverse and `isMaster: NO` key,
    then editing this array will modify the underlying data, but the
    inverse key on the matching record will also be edited and that
    record will be marked as needing a change.

    @param {SC.Record|String} recordType The type of record to create
    @param {Hash} opts the options for the attribute
    @returns {SC.ManyAttribute|SC.ChildrenAttribute} created instance
  */
  toMany: function(recordType, opts) {
    opts = opts || {};
    var isNested = opts.nested || opts.isNested;
    var attr;
    if(isNested){
      attr = SC.ChildrenAttribute.attr(recordType, opts);
    }
    else {
      attr = SC.ManyAttribute.attr(recordType, opts);
    }
    return attr.computed();
  },

  /**
    Will return one of the following:

     1. `SC.SingleAttribute` that converts the underlying ID to a single
        record.  If you modify this property, it will rewrite the underyling
        ID. It will also modify the inverse of the relationship, if you set it.
     2. `SC.ChildAttribute` that you can edit the contents
        of this relationship.

    @param {SC.Record|String} recordType the type of the record to create
    @param {Hash} opts additional options
    @returns {SC.SingleAttribute|SC.ChildAttribute} created instance
  */
  toOne: function(recordType, opts) {
    opts = opts || {};
    var isNested = opts.nested || opts.isNested;
    var attr;
    if(isNested){
      attr = SC.ChildAttribute.attr(recordType, opts);
    }
    else {
      attr = SC.SingleAttribute.attr(recordType, opts);
    }
    return attr.computed();
  },

  /**
    Returns all storeKeys mapped by Id for this record type.  This method is
    used mostly by the `SC.Store` and the Record to coordinate.  You will
    rarely need to call this method yourself.

    @returns {Hash}
  */
  storeKeysById: function() {
    var key = 'storeKey-'+SC.guidFor(this),
        ret = this[key];
    if (!ret) ret = this[key] = {};
    return ret;
  },

  /**
    Given a primaryKey value for the record, returns the associated
    storeKey.  If the primaryKey has not been assigned a storeKey yet, it
    will be added.

    For the inverse of this method see `SC.Store.idFor()` and
    `SC.Store.recordTypeFor()`.

    @param {String} id a record id
    @returns {Number} a storeKey.
  */
  storeKeyFor: function(id) {
    var storeKeys = this.storeKeysById(),
        ret       = storeKeys[id];

    if (!ret) {
      ret = SC.Store.generateStoreKey();
      SC.Store.idsByStoreKey[ret] = id ;
      SC.Store.recordTypesByStoreKey[ret] = this ;
      storeKeys[id] = ret ;
    }

    return ret ;
  },

  /**
    Given a primaryKey value for the record, returns the associated
    storeKey.  As opposed to `storeKeyFor()` however, this method
    will NOT generate a new storeKey but returned undefined.

    @param {String} id a record id
    @returns {Number} a storeKey.
  */
  storeKeyExists: function(id) {
    var storeKeys = this.storeKeysById(),
        ret       = storeKeys[id];

    return ret ;
  },

  /**
    Returns a record with the named ID in store.

    @param {SC.Store} store the store
    @param {String} id the record id or a query
    @returns {SC.Record} record instance
  */
  find: function(store, id) {
    return store.find(this, id);
  },

  /** @private - enhance extend to notify SC.Query as well. */
  extend: function() {
    var ret = SC.Object.extend.apply(this, arguments);

    // Clear aggregates cache when creating a new subclass
    // of SC.Record
    ret.aggregates = null;

    SC.Query._scq_didDefineRecordType(ret);
    return ret ;
  }
}) ;

K = SC.Record;

})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



var get = SC.get, set = SC.set, getPath = SC.getPath;

/** @class

  A RecordAttribute describes a single attribute on a record.  It is used to
  generate computed properties on records that can automatically convert data
  types and verify data.

  When defining an attribute on an SC.Record, you can configure it this way:

      title: SC.Record.attr(String, {
        defaultValue: 'Untitled',
        isRequired: YES|NO
      })

  In addition to having predefined transform types, there is also a way to
  set a computed relationship on an attribute. A typical example of this would
  be if you have record with a parentGuid attribute, but are not able to
  determine which record type to map to before looking at the guid (or any
  other attributes). To set up such a computed property, you can attach a
  function in the attribute definition of the SC.Record subclass:

      relatedToComputed: SC.Record.toOne(function() {
        return (this.readAttribute('relatedToComputed').indexOf("foo")==0) ? MyApp.Foo : MyApp.Bar;
      })

  Notice that we are not using get() to avoid another transform which would
  trigger an infinite loop.

  You usually will not work with RecordAttribute objects directly, though you
  may extend the class in any way that you like to create a custom attribute.

  A number of default RecordAttribute types are defined on the SC.Record.

  @extends SC.Object
  @see SC.Record
  @see SC.ManyAttribute
  @see SC.SingleAttribute
  @since SproutCore 1.0
*/
SC.RecordAttribute = SC.Object.extend(
  /** @scope SC.RecordAttribute.prototype */ {
  /**
    Walk like a duck.

    @type Boolean
    @default YES
  */
  isRecordAttribute: YES,

  /**
    The default value.  If attribute is `null` or `undefined`, this default
    value will be substituted instead.  Note that `defaultValue`s are not
    converted, so the value should be in the output type expected by the
    attribute.

    If you use a `defaultValue` function, the arguments given to it are the
    record instance and the key.

    @type Object|function
    @default null
  */
  defaultValue: null,

  /**
    The attribute type.  Must be either an object class or a property path
    naming a class.  The built in handler allows all native types to pass
    through, converts records to ids and dates to UTF strings.

    If you use the `attr()` helper method to create a RecordAttribute instance,
    it will set this property to the first parameter you pass.

    @type Object|String
    @default String
  */
  type: String,

  /**
    The underlying attribute key name this attribute should manage.  If this
    property is left empty, then the key will be whatever property name this
    attribute assigned to on the record.  If you need to provide some kind
    of alternate mapping, this provides you a way to override it.

    @type String
    @default null
  */
  key: null,

  /**
    If `YES`, then the attribute is required and will fail validation unless
    the property is set to a non-null or undefined value.

    @type Boolean
    @default NO
  */
  isRequired: NO,

  /**
    If `NO` then attempts to edit the attribute will be ignored.

    @type Boolean
    @default YES
  */
  isEditable: YES,

  /**
    If set when using the Date format, expect the ISO8601 date format.
    This is the default.

    @type Boolean
    @default YES
  */
  useIsoDate: YES,

  /**
    Can only be used for toOne or toMany relationship attributes. If YES,
    this flag will ensure that any related objects will also be marked
    dirty when this record dirtied.

    Useful when you might have multiple related objects that you want to
    consider in an 'aggregated' state. For instance, by changing a child
    object (image) you might also want to automatically mark the parent
    (album) dirty as well.

    @type Boolean
    @default NO
  */
  aggregate: NO,

  // ..........................................................
  // HELPER PROPERTIES
  //

  /**
    Returns the type, resolved to a class.  If the type property is a regular
    class, returns the type unchanged.  Otherwise attempts to lookup the
    type as a property path.

    @property
    @type Object
    @default String
  */
  typeClass: function() {
    var ret = get(this, 'type');
    if (SC.typeOf(ret) === 'string') ret = getPath(ret);
    return ret ;
  }.property('type').cacheable(),

  /**
    Finds the transform handler. Attempts to find a transform that you
    registered using registerTransform for this attribute's type, otherwise
    defaults to using the default transform for String.

    @property
    @type Transform
  */
  transform: function() {
    var klass      = get(this, 'typeClass') || String,
        transforms = SC.RecordAttribute.transforms,
        ret ;

    // walk up class hierarchy looking for a transform handler
    while(klass && !(ret = transforms[SC.guidFor(klass)])) {
      // check if super has create property to detect SC.Object's
      if(klass.superclass && klass.superclass.hasOwnProperty('create')) {
        klass = klass.superclass ;
      }

      // otherwise return the function transform handler
      else klass = 'function' ;
    }

    return ret ;
  }.property('typeClass').cacheable(),

  // ..........................................................
  // LOW-LEVEL METHODS
  //

  /**
    Converts the passed value into the core attribute value.  This will apply
    any format transforms.  You can install standard transforms by adding to
    the `SC.RecordAttribute.transforms` hash.  See
    SC.RecordAttribute.registerTransform() for more.

    @param {SC.Record} record The record instance
    @param {String} key The key used to access this attribute on the record
    @param {Object} value The property value before being transformed
    @returns {Object} The transformed value
  */
  toType: function(record, key, value) {
    var transform = get(this, 'transform'),
        type      = get(this, 'typeClass'),
        children;

    if (transform && transform.to) {
      value = transform.to(value, this, type, record, key) ;

      // if the transform needs to do something when its children change, we need to set up an observer for it
      if(!SC.none(value) && (children = transform.observesChildren)) {
        var i, len = children.length,
        // store the record, transform, and key so the observer knows where it was called from
        context = {
          record: record,
          key: key
        };

        for(i = 0; i < len; i++) SC.addObserver(value, children[i], this, this._SCRA_childObserver, context);
      }
    }

    return value ;
  },

  /**
    @private

    Shared observer used by any attribute whose transform creates a seperate
    object that needs to write back to the datahash when it changes. For
    example, when enumerable content changes on a `SC.Set` attribute, it
    writes back automatically instead of forcing you to call `.set` manually.

    This functionality can be used by setting an array named
    observesChildren on your transform containing the names of keys to
    observe. When one of them triggers it will call childDidChange on your
    transform with the same arguments as to and from.

    @param {Object} obj The transformed value that is being observed
    @param {String} key The key used to access this attribute on the record
    @param {Object} prev Previous value (not used)
    @param {Object} context Hash of extra context information
  */
  _SCRA_childObserver: function(obj, key, prev, context) {
    // write the new value back to the record
    this.call(context.record, context.key, obj);

    // mark the attribute as dirty
    context.record.notifyPropertyChange(context.key);
  },

  /**
    Converts the passed value from the core attribute value.  This will apply
    any format transforms.  You can install standard transforms by adding to
    the `SC.RecordAttribute.transforms` hash.  See
    `SC.RecordAttribute.registerTransform()` for more.

    @param {SC.Record} record The record instance
    @param {String} key The key used to access this attribute on the record
    @param {Object} value The transformed value
    @returns {Object} The value converted back to attribute format
  */
  fromType: function(record, key, value) {
    var transform = get(this, 'transform'),
        type      = get(this, 'typeClass');

    if (transform && transform.from) {
      value = transform.from(value, this, type, record, key);
    }
    return value;
  },

  /**
    The core handler. Called when `get()` is called on the
    parent record, since `SC.RecordAttribute` uses `isProperty` to masquerade
    as a computed property. Get expects a property be a function, thus we
    need to implement call.

    @param {SC.Record} record The record instance
    @param {String} key The key used to access this attribute on the record
    @param {Object} value The property value if called as a setter
    @returns {Object} property value
  */
  call: function(record, key, value) {
    var attrKey = get(this, 'key') || key, nvalue;

    if ((value !== undefined) && get(this, 'isEditable')) {
      // careful: don't overwrite value here.  we want the return value to
      // cache.
      nvalue = this.fromType(record, key, value) ; // convert to attribute.
      record.writeAttribute(attrKey, nvalue);
    }

    nvalue = value = record.readAttribute(attrKey);
    if (SC.none(value) && (value = get(this, 'defaultValue'))) {
       if (typeof value === 'function') {
        value = this.defaultValue(record, key, this);
        // write default value so it doesn't have to be executed again
        if ((nvalue !== value)  &&  get(record, 'store').readDataHash(get(record, 'storeKey'))) {
          record.writeAttribute(attrKey, value, true);
        }
      }
    } else value = this.toType(record, key, value);

    return value ;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private - Make this look like a property so that `get()` will call it. */
  isProperty: YES,

  /** @private - Make this look cacheable */
  isCacheable: YES,

  /** @private - needed for KVO `property()` support */
  dependentKeys: [],

  /** @private */
  init: function() {
    this._super();
    // setup some internal properties needed for KVO - faking 'cacheable'
    this.cacheKey = "__cache__" + SC.guidFor(this) ;
    this.lastSetValueKey = "__lastValue__" + SC.guidFor(this) ;
  },

  /**
    @private

    Returns a computed property value that can be assigned directly to a
    property on a record for this attribute.
  */
  computed: function() {
    var attr = this;
    var ret  = SC.computed(function(key, value) {
      return attr.call(this, key, value);
    });
    ret.attr = attr;
    return ret ;
  }
}) ;

// ..........................................................
// CLASS METHODS
//

SC.RecordAttribute.reopenClass(
  /** @scope SC.RecordAttribute.prototype */{
  /**
    The default method used to create a record attribute instance.  Unlike
    `create()`, takes an `attributeType` as the first parameter which will be
    set on the attribute itself.  You can pass a string naming a class or a
    class itself.

    @static
    @param {Object|String} attributeType the assumed attribute type
    @param {Hash} opts optional additional config options
    @returns {SC.RecordAttribute} new instance
  */
  attr: function(attributeType, opts) {
    if (!opts) opts = {} ;
    if (!opts.type) opts.type = attributeType || String ;
    return this.create(opts);
  },

  /** @private
    Hash of registered transforms by class guid.
  */
  transforms: {},

  /**
    Call to register a transform handler for a specific type of object.  The
    object you pass can be of any type as long as it responds to the following
    methods

     - `to(value, attr, klass, record, key)` converts the passed value
       (which will be of the class expected by the attribute) into the
       underlying attribute value
     - `from(value, attr, klass, record, key)` converts the underyling
       attribute value into a value of the class

    You can also provide an array of keys to observer on the return value.
    When any of these change, your from method will be called to write the
    changed object back to the record. For example:

        {
          to: function(value, attr, type, record, key) {
            if(value) return value.toSet();
            else return SC.Set.create();
          },

          from: function(value, attr, type, record, key) {
            return value.toArray();
          },

          observesChildren: ['[]']
        }

    @static
    @param {Object} klass the type of object you convert
    @param {Object} transform the transform object
    @returns {SC.RecordAttribute} receiver
  */
  registerTransform: function(klass, transform) {
    SC.RecordAttribute.transforms[SC.guidFor(klass)] = transform;
  },

  /**
    Retrieves the original record attribute for the passed key.  You can't
    use get() to retrieve record attributes because that will invoke the
    property instead.

    @param {SC.Record} rec record instance to inspect
    @param {String} keyName key name to retrieve
    @returns {SC.RecordAttribute} the attribute or null if none defined
  */
  attrFor: function(rec, keyName) {
    var ret = SC.meta(rec, false).descs[keyName];
    return ret && ret.attr;
  }
});

// ..........................................................
// STANDARD ATTRIBUTE TRANSFORMS
//

// Object, String, Number just pass through.

/** @private - generic converter for Boolean records */
SC.RecordAttribute.registerTransform(Boolean, {
  /** @private - convert an arbitrary object value to a boolean */
  to: function(obj) {
    return SC.none(obj) ? null : !!obj;
  }
});

/** @private - generic converter for Numbers */
SC.RecordAttribute.registerTransform(Number, {
  /** @private - convert an arbitrary object value to a Number */
  to: function(obj) {
    return SC.none(obj) ? null : Number(obj) ;
  }
});

/** @private - generic converter for Strings */
SC.RecordAttribute.registerTransform(String, {
  /** @private -
    convert an arbitrary object value to a String
    allow null through as that will be checked separately
  */
  to: function(obj) {
    if (!(typeof obj === 'string') && !SC.none(obj) && obj.toString) {
      obj = obj.toString();
    }
    return obj;
  }
});

/** @private - generic converter for Array */
SC.RecordAttribute.registerTransform(Array, {
  /** @private - check if obj is an array
  */
  to: function(obj) {
    if (!SC.isArray(obj) && !SC.none(obj)) {
      obj = [];
    }
    return obj;
  },

  observesChildren: ['[]']
});

/** @private - generic converter for Object */
SC.RecordAttribute.registerTransform(Object, {
  /** @private - check if obj is an object */
  to: function(obj) {
    if (!(typeof obj === 'object') && !SC.none(obj)) {
      obj = {};
    }
    return obj;
  }
});

/** @private - generic converter for SC.Record-type records */
SC.RecordAttribute.registerTransform(SC.Record, {

  /** @private - convert a record id to a record instance */
  to: function(id, attr, recordType, parentRecord) {
    var store = get(parentRecord, 'store');
    if (SC.none(id) || (id==="")) return null;
    else return store.find(recordType, id);
  },

  /** @private - convert a record instance to a record id */
  from: function(record) { return record ? get(record, 'id') : null; }
});

/** @private - generic converter for transforming computed record attributes */
SC.RecordAttribute.registerTransform('function', {

  /** @private - convert a record id to a record instance */
  to: function(id, attr, recordType, parentRecord) {
    recordType = recordType.apply(parentRecord);
    var store = get(parentRecord, 'store');
    return store.find(recordType, id);
  },

  /** @private - convert a record instance to a record id */
  from: function(record) { return get(record, 'id'); }
});

/** @private - generic converter for Date records */
SC.RecordAttribute.registerTransform(Date, {

  /** @private - convert a string to a Date */
  to: function(str, attr) {

    // If a null or undefined value is passed, don't
    // do any normalization.
    if (SC.none(str)) { return str; }

    var ret ;
    str = str.toString() || '';

    if (get(attr, 'useIsoDate')) {
      var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
             "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?" +
             "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?",
          d      = str.match(new RegExp(regexp)),
          offset = 0,
          date   = new Date(d[1], 0, 1),
          time ;

      if (d[3]) { date.setMonth(d[3] - 1); }
      if (d[5]) { date.setDate(d[5]); }
      if (d[7]) { date.setHours(d[7]); }
      if (d[8]) { date.setMinutes(d[8]); }
      if (d[10]) { date.setSeconds(d[10]); }
      if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
      if (d[14]) {
         offset = (Number(d[16]) * 60) + Number(d[17]);
         offset *= ((d[15] === '-') ? 1 : -1);
      }

      offset -= date.getTimezoneOffset();
      time = (Number(date) + (offset * 60 * 1000));

      ret = new Date();
      ret.setTime(Number(time));
    } else ret = new Date(Date.parse(str));
    return ret ;
  },

  _dates: {},

  /** @private - pad with leading zeroes */
  _zeropad: function(num) {
    return ((num<0) ? '-' : '') + ((num<10) ? '0' : '') + Math.abs(num);
  },

  /** @private - convert a date to a string */
  from: function(date) {

    if (SC.none(date)) { return null; }

    var ret = this._dates[date.getTime()];
    if (ret) return ret ;

    // figure timezone
    var zp = this._zeropad,
        tz = 0-date.getTimezoneOffset()/60;

    tz = (tz === 0) ? 'Z' : '%@:00'.fmt(zp(tz));

    this._dates[date.getTime()] = ret = "%@-%@-%@T%@:%@:%@%@".fmt(
      zp(date.getFullYear()),
      zp(date.getMonth()+1),
      zp(date.getDate()),
      zp(date.getHours()),
      zp(date.getMinutes()),
      zp(date.getSeconds()),
      tz) ;

    return ret ;
  }
});

if (SC.DateTime && !SC.RecordAttribute.transforms[SC.guidFor(SC.DateTime)]) {
  /**
    Registers a transform to allow `SC.DateTime` to be used as a record
    attribute, ie `SC.Record.attr(SC.DateTime);`

    Because `SC.RecordAttribute` is in the datastore framework and
    `SC.DateTime` in the foundation framework, and we don't know which
    framework is being loaded first, this chunck of code is duplicated in
    both frameworks.

    IF YOU EDIT THIS CODE MAKE SURE YOU COPY YOUR CHANGES to
    `record_attribute.js.`
  */

  SC.RecordAttribute.registerTransform(SC.DateTime, {

    /** @private
      Convert a String to a DateTime
    */
    to: function(str, attr) {
      if (SC.none(str) || (str instanceof SC.DateTime)) return str;
      if (SC.none(str) || (str instanceof Date)) return SC.DateTime.create(str.getTime());
      var format = get(attr, 'format');
      return SC.DateTime.parse(str, format ? format : SC.DateTime.recordFormat);
    },

    /** @private
      Convert a DateTime to a String
    */
    from: function(dt, attr) {
      if (SC.none(dt)) return dt;
      var format = get(attr, 'format');
      return dt.toFormattedString(format ? format : SC.DateTime.recordFormat);
    }
  });

}

/**
  Parses a coreset represented as an array.
 */
SC.RecordAttribute.registerTransform(SC.Set, {
  to: function(value, attr, type, record, key) {
    return SC.Set.create(value);
  },

  from: function(value, attr, type, record, key) {
    return value.toArray();
  },

  observesChildren: ['[]']
});


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2010 Evin Grano
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var get = SC.get, set = SC.set;

/** @class

  ChildAttribute is a subclass of `RecordAttribute` and handles to-one
  relationships for child records.

  When setting ( `set()` ) the value of a toMany attribute, make sure
  to pass in an array of `SC.Record` objects.

  There are many ways you can configure a ManyAttribute:

      contacts: SC.ChildAttribute.attr('SC.Child');

  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.ChildAttribute = SC.RecordAttribute.extend(
  /** @scope SC.ChildAttribute.prototype */ {

  isNestedRecordTransform: YES,

  // ..........................................................
  // LOW-LEVEL METHODS
  //

  /**  @private - adapted for to one relationship */
  toType: function(record, key, value) {
    var ret   = null, rel,
        recordType  = get(this, 'typeClass');

    if (!record) {
      throw 'SC.Child: Error during transform: Unable to retrieve parent record.';
    }
    if (!SC.none(value)) ret = record.registerNestedRecord(value, key);

    return ret;
  },

  // Default fromType is just returning itself
  fromType: function(record, key, value) {
    var sk, store, ret;

    if (record) {
      if (SC.none(value)) {
        // Handle null value.
        record.writeAttribute(key, value);
        ret = value;
      } else {
        // Register the nested record with this record (the parent).
        ret = record.registerNestedRecord(value, key);

        if (ret) {
          // Write the data hash of the nested record to the store.
          sk = get(ret, 'storeKey');
          store = get(ret, 'store');
          record.writeAttribute(key, store.readDataHash(sk));
        } else if (value) {
          // If registration failed, just write the value.
          record.writeAttribute(key, value);
        }
      }
    }

    return ret;
  },

  /**
    The core handler.  Called from the property.
    @param {SC.Record} record the record instance
    @param {String} key the key used to access this attribute on the record
    @param {Object} value the property value if called as a setter
    @returns {Object} property value
  */
  call: function(record, key, value) {
    var attrKey = get(this, 'key') || key, cRef,
        cacheKey = '__kid__'+SC.guidFor(this);
    if (value !== undefined) {
      // this.orphan(record, cacheKey, value);
      value = this.fromType(record, key, value) ; // convert to attribute.
      // record[cacheKey] = value;
    } else {
      value = record.readAttribute(attrKey);
      if (SC.none(value) && (value = get(this, 'defaultValue'))) {
        if (typeof value === 'function') {
          value = this.defaultValue(record, key, this);
          // write default value so it doesn't have to be executed again
          if(get(record, 'attributes')) record.writeAttribute(attrKey, value, true);
        }
      } else value = this.toType(record, key, value);
    }

    return value ;
  }
});



})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2010 Evin Grano
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set, getPath = SC.getPath;

/**
  @class

  A `ChildArray` is used to map an array of `ChildRecord` objects.

  @extends SC.Enumerable
  @extends SC.Array
  @since SproutCore 1.0
*/

SC.ChildArray = SC.Object.extend(SC.Enumerable, SC.Array, SC.MutableEnumerable, SC.MutableArray,
  /** @scope SC.ChildArray.prototype */ {

  /**
    If set, it is the default record `recordType`

    @default null
    @type String
  */
  defaultRecordType: null,

  /**
    If set, the parent record will be notified whenever the array changes so that
    it can change its own state

    @default null
    @type {SC.Record}
  */
  record: null,

  /**
    If set will be used by the many array to get an editable version of the
    `storeId`s from the owner.

    @default null
    @type String
  */
  propertyName: null,

  /**
    Actual references to the hashes

    @default null
    @type {SC.Array}
  */
  children: null,

  /**
    The store that owns this record array.  All record arrays must have a
    store to function properly.

    @type SC.Store
    @property
  */
  store: function() {
    return getPath(this, 'record.store');
  }.property('record').cacheable(),

  /**
    The storeKey for the parent record of this many array.  Editing this
    array will place the parent record into a `READY_DIRTY state.

    @type Number
    @property
  */
  storeKey: function() {
    return getPath(this, 'record.storeKey');
  }.property('record').cacheable(),

  /**
    Returns the storeIds in read only mode.  Avoids modifying the record
    unnecessarily.

    @type SC.Array
    @property
  */
  readOnlyChildren: function() {
    return get(this, 'record').readAttribute(get(this, 'propertyName'));
  }.property(),

  /**
    Returns an editable array of child hashes.  Marks the owner records as
    modified.

    @type {SC.Array}
    @property
  */
  editableChildren: function() {
    var store    = get(this, 'store'),
        storeKey = get(this, 'storeKey'),
        pname    = get(this, 'propertyName'),
        ret, hash;

    ret = store.readEditableProperty(storeKey, pname);
    if (!ret) {
      hash = store.readEditableDataHash(storeKey);
      ret = hash[pname] = [];
    }

    if (ret !== this._prevChildren) this.recordPropertyDidChange();
    return ret ;
  }.property(),

  // ..........................................................
  // ARRAY PRIMITIVES
  //

  /** @private
    Returned length is a pass-through to the storeIds array.

    @type Number
    @property
  */
  length: function() {
    var children = get(this, 'readOnlyChildren');
    return children ? children.length : 0;
  }.property('readOnlyChildren'),

  /**
    Looks up the store id in the store ids array and materializes a
    records.

    @param {Number} idx index of the object to retrieve.
    @returns {SC.Record} The record if found or undefined.
  */
  objectAt: function(idx) {
    var recs      = this._records,
        children = get(this, 'readOnlyChildren'),
        hash, ret, pname = get(this, 'propertyName'),
        parent = get(this, 'record');
    var len = children ? children.length : 0;

    if (!children) return undefined; // nothing to do
    if (recs && (ret=recs[idx])) return ret ; // cached
    if (!recs) this._records = recs = [] ; // create cache

    // If not a good index return undefined
    if (idx >= len) return undefined;
    hash = children.objectAt(idx);
    if (!hash) return undefined;

    // not in cache, materialize
    recs[idx] = ret = parent.registerNestedRecord(hash, pname, pname+'.'+idx);

    return ret;
  },

  /**
    Pass through to the underlying array.  The passed in objects must be
    records, which can be converted to `storeId`s.

    @param {Number} idx index of the object to replace.
    @param {Number} amt number of records to replace starting at idx.
    @param {Number} recs array with records to replace.
    @returns {SC.Record} The record if found or undefined.

  */
  replace: function(idx, amt, recs) {
    var children = get(this, 'editableChildren'),
        len      = recs ? get(recs, 'length') : 0,
        record   = get(this, 'record'), newRecs,

        pname    = get(this, 'propertyName'),
        cr, recordType;
    newRecs = this._processRecordsToHashes(recs);
    children.replace(idx, amt, newRecs);
    // notify that the record did change...
    record.recordDidChange(pname);

    return this;
  },

  /** @private

    Converts a records array into an array of hashes.

    @param {SC.Array} recs records to be converted to hashes.
    @returns {SC.Array} array of hashes.
  */
  _processRecordsToHashes: function(recs){
    var store, sk;
    recs = recs || [];
    recs.forEach( function(me, idx) {
      if (me instanceof SC.Record) {
        store = get(me, 'store');
        sk = get(me, 'storeKey');
        if (sk) recs[idx] = store.readDataHash(sk);
      }
    });

    return recs;
  },

  /**
    Calls normalize on each object in the array
  */
  normalize: function(){
    this.forEach(function(child,id){
      if(child.normalize) child.normalize();
    });
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /**
    Invoked whenever the children array changes.  Observes changes.

    @param {SC.Array} keys optional
    @returns {SC.ChildArray} itself.
  */
  recordPropertyDidChange: function(keys) {
    if (keys && !keys.contains(get(this, 'propertyName'))) return this;

    var children = get(this, 'readOnlyChildren'), oldLen = 0, newLen = 0;
    var prev = this._prevChildren, f = this._childrenContentDidChange;

    if (children === prev) return this; // nothing to do

    if (prev) {
      prev.removeArrayObserver(this, {
        willChange: this.arrayContentWillChange,
        didChange: f
      });

      oldLen = get(prev, 'length');
    }

    if (children) {
      children.addArrayObserver(this, {
        willChange: this.arrayContentWillChange,
        didChange: f
      });

      newLen = get(children, 'length');
    }


    this.arrayContentWillChange(0, oldLen, newLen);
    this._prevChildren = children;
    this._childrenContentDidChange(children, 0, oldLen, newLen);

    return this;
  },

  /** @private
    Invoked whenever the content of the children array changes.  This will
    dump any cached record lookup and then notify that the enumerable content
    has changed.

    @param {Number} target
    @param {Number} key
    @param {Number} value
    @param {Number} rev
  */
  _childrenContentDidChange: function(content, start, removedCount, addedCount) {
    this._records = null ; // clear cache
    this.arrayContentDidChange(start, removedCount, addedCount);
  },

  /** @private */
  init: function() {
    this._super();
    this.recordPropertyDidChange();
  }

}) ;


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2010 Evin Grano
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





var get = SC.get, set = SC.set;

/** @class

  ChildrenAttribute is a subclass of ChildAttribute and handles to-many
  relationships for child records.

  When setting ( `set()` ) the value of a toMany attribute, make sure
  to pass in an array of SC.Record objects.

  There are many ways you can configure a ChildrenAttribute:

      contacts: SC.ChildrenAttribute.attr('SC.Child');

  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.ChildrenAttribute = SC.ChildAttribute.extend(
  /** @scope SC.ChildrenAttribute.prototype */ {

  // ..........................................................
  // LOW-LEVEL METHODS
  //

  /**  @private - adapted for to many relationship */
  toType: function(record, key, value) {
    var attrKey   = get(this, 'key') || key,
        arrayKey  = '__kidsArray__'+SC.guidFor(this),
        ret       = record[arrayKey],
        recordType  = get(this, 'typeClass'), rel;

    // lazily create a ManyArray one time.  after that always return the
    // same object.
    if (!ret) {
      ret = SC.ChildArray.create({
        record:         record,
        propertyName:   attrKey,
        defaultRecordType: recordType
      });

      record[arrayKey] = ret ; // save on record
      rel = get(record, 'relationships');
      if (!rel) set(record, 'relationships', rel = []);
      rel.push(ret); // make sure we get notified of changes...
    }

    return ret;
  },

  // Default fromType is just returning itself
  fromType: function(record, key, value){
    var sk, store,
        arrayKey = '__kidsArray__'+SC.guidFor(this),
        ret = record[arrayKey];
    if (record) {
      record.writeAttribute(key, value);
      if (ret) ret = ret.recordPropertyDidChange();
    }

    return ret;
  }
});



})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var get = SC.get, set = SC.set, attrFor = SC.RecordAttribute.attrFor;

/**
  @class

  A `ManyArray` is used to map an array of record ids back to their
  record objects which will be materialized from the owner store on demand.

  Whenever you create a `toMany()` relationship, the value returned from the
  property will be an instance of `ManyArray`.  You can generally customize the
  behavior of ManyArray by passing settings to the `toMany()` helper.

  @extends SC.Enumerable
  @extends SC.Array
  @since SproutCore 1.0
*/

SC.ManyArray = SC.Object.extend(SC.Enumerable, SC.MutableEnumerable, SC.MutableArray, SC.Array,
  /** @scope SC.ManyArray.prototype */ {

  /**
    `recordType` will tell what type to transform the record to when
    materializing the record.

    @default null
    @type String
  */
  recordType: null,

  /**
    If set, the record will be notified whenever the array changes so that
    it can change its own state

    @default null
    @type SC.Record
  */
  record: null,

  /**
    If set will be used by the many array to get an editable version of the
    storeIds from the owner.

    @default null
    @type String
  */
  propertyName: null,


  /**
    The `ManyAttribute` that created this array.

    @default null
    @type SC.ManyAttribute
  */
  manyAttribute: null,

  /**
    The store that owns this record array.  All record arrays must have a
    store to function properly.

    @type SC.Store
    @property
  */
  store: function() {
    return get(get(this, 'record'), 'store');
  }.property('record').cacheable(),

  /**
    The `storeKey` for the parent record of this many array.  Editing this
    array will place the parent record into a `READY_DIRTY` state.

    @type Number
    @property
  */
  storeKey: function() {
    return get(get(this, 'record'), 'storeKey');
  }.property('record').cacheable(),


  /**
    Returns the `storeId`s in read-only mode.  Avoids modifying the record
    unnecessarily.

    @type SC.Array
    @property
  */
  readOnlyStoreIds: function() {
    return get(this, 'record').readAttribute(get(this, 'propertyName'));
  }.property(),


  /**
    Returns an editable array of `storeId`s.  Marks the owner records as
    modified.

    @type {SC.Array}
    @property
  */
  editableStoreIds: function() {
    var store    = get(this, 'store'),
        storeKey = get(this, 'storeKey'),
        pname    = get(this, 'propertyName'),
        ret, hash;

    ret = store.readEditableProperty(storeKey, pname);
    if (!ret) {
      hash = store.readEditableDataHash(storeKey);
      ret = hash[pname] = [];
    }

    if (ret !== this._prevStoreIds) this.recordPropertyDidChange();
    return ret ;
  }.property(),


  // ..........................................................
  // COMPUTED FROM OWNER
  //

  /**
    Computed from owner many attribute

    @type Boolean
    @property
  */
  isEditable: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? get(attr, 'isEditable') : NO;
  }.property('manyAttribute').cacheable(),

  /**
    Computed from owner many attribute

    @type String
    @property
  */
  inverse: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? get(attr, 'inverse') : null;
  }.property('manyAttribute').cacheable(),

  /**
    Computed from owner many attribute

    @type Boolean
    @property
  */
  isMaster: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? get(attr, 'isMaster') : null;
  }.property("manyAttribute").cacheable(),

  /**
    Computed from owner many attribute

    @type Array
    @property
  */
  orderBy: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? get(attr, 'orderBy') : null;
  }.property("manyAttribute").cacheable(),

  // ..........................................................
  // ARRAY PRIMITIVES
  //

  /** @private
    Returned length is a pass-through to the `storeIds` array.

    @type Number
    @property
  */
  length: function() {
    var storeIds = get(this, 'readOnlyStoreIds');
    return storeIds ? get(storeIds, 'length') : 0;
  }.property('readOnlyStoreIds'),

  /** @private
    Looks up the store id in the store ids array and materializes a
    records.
  */
  objectAt: function(idx) {
    var recs      = this._records,
        storeIds  = get(this, 'readOnlyStoreIds'),
        store     = get(this, 'store'),
        recordType = get(this, 'recordType'),
        storeKey, ret, storeId ;

    if (!storeIds || !store) return undefined; // nothing to do
    if (recs && (ret=recs[idx])) return ret ; // cached

    // not in cache, materialize
    if (!recs) this._records = recs = [] ; // create cache
    storeId = storeIds.objectAt(idx);
    if (storeId) {

      // if record is not loaded already, then ask the data source to
      // retrieve it
      storeKey = store.storeKeyFor(recordType, storeId);

      if (store.readStatus(storeKey) === SC.Record.EMPTY) {
        store.retrieveRecord(recordType, null, storeKey);
      }

      recs[idx] = ret = store.materializeRecord(storeKey);
    }
    return ret ;
  },

  /** @private
    Pass through to the underlying array.  The passed in objects must be
    records, which can be converted to `storeId`s.
  */
  replace: function(idx, amt, recs) {

    if (!get(this, 'isEditable')) {
      throw "%@.%@[] is not editable".fmt(get(this, 'record'), get(this, 'propertyName'));
    }

    var storeIds = get(this, 'editableStoreIds'),
        len      = recs ? get(recs, 'length') : 0,
        record   = get(this, 'record'),
        pname    = get(this, 'propertyName'),
        i, keys, ids, toRemove, inverse, attr, inverseRecord;

    // map to store keys
    ids = [] ;
    for(i=0;i<len;i++) ids[i] = get(recs.objectAt(i), 'id');

    // if we have an inverse - collect the list of records we are about to
    // remove
    inverse = get(this, 'inverse');
    if (inverse && amt>0) {
      toRemove = SC.ManyArray._toRemove;
      if (toRemove) SC.ManyArray._toRemove = null; // reuse if possible
      else toRemove = [];

      for(i=0;i<amt;i++) toRemove[i] = this.objectAt(idx + i);
    }

    // pass along - if allowed, this should trigger the content observer
    storeIds.replace(idx, amt, ids);

    // ok, notify records that were removed then added; this way reordered
    // objects are added and removed
    if (inverse) {

      // notive removals
      for(i=0;i<amt;i++) {
        inverseRecord = toRemove[i];
        attr = inverseRecord ? attrFor(inverseRecord, inverse) : null;
        if (attr && attr.inverseDidRemoveRecord) {
          attr.inverseDidRemoveRecord(inverseRecord, inverse, record, pname);
        }
      }

      if (toRemove) {
        toRemove.length = 0; // cleanup
        if (!SC.ManyArray._toRemove) SC.ManyArray._toRemove = toRemove;
      }

      // notify additions
      for(i=0;i<len;i++) {
        inverseRecord = recs.objectAt(i);
        attr = inverseRecord ? attrFor(inverseRecord, inverse) : null;
        if (attr && attr.inverseDidAddRecord) {
          attr.inverseDidAddRecord(inverseRecord, inverse, record, pname);
        }
      }

    }

    // only mark record dirty if there is no inverse or we are master
    if (record && (!inverse || get(this, 'isMaster'))) {
      record.recordDidChange(pname);
    }

    this.enumerableContentDidChange(idx, amt, len - amt);

    return this;
  },

  // ..........................................................
  // INVERSE SUPPORT
  //

  /**
    Called by the `ManyAttribute` whenever a record is removed on the inverse
    of the relationship.

    @param {SC.Record} inverseRecord the record that was removed
    @returns {SC.ManyArray} receiver
  */
  removeInverseRecord: function(inverseRecord) {

    if (!inverseRecord) return this; // nothing to do
    var id = get(inverseRecord, 'id'),
        storeIds = get(this, 'editableStoreIds'),
        idx      = (storeIds && id) ? storeIds.indexOf(id) : -1,
        record;

    if (idx >= 0) {
      storeIds.removeAt(idx);
      if (get(this, 'isMaster') && (record = get(this, 'record'))) {
        record.recordDidChange(get(this, 'propertyName'));
      }
    }

    return this;
  },

  _inverseRecordDidLoad: function(obj, key, val) {
    var store = get(this, 'store');
    var id    = store.idFor(obj.get("storeKey"));
    if(id) {
      obj.removeObserver("status", this, "_inverseRecordDidLoad");
      this.addInverseRecord(obj);
    }
  },

  /**
    Called by the `ManyAttribute` whenever a record is added on the inverse
    of the relationship.

    @param {SC.Record} inverseRecord the record this array is a part of
    @returns {SC.ManyArray} receiver
  */
  addInverseRecord: function(inverseRecord) {

    if (!inverseRecord) return this;
    var store = get(this, 'store');
    var id    = store.idFor(inverseRecord.get("storeKey"));

    if(!id) {
      inverseRecord.addObserver("status", this, "_inverseRecordDidLoad");
      return this;
    }

    var storeIds = get(this, 'editableStoreIds'),
        orderBy  = get(this, 'orderBy'),
        len      = get(storeIds, 'length'),
        idx, record;

    // find idx to insert at.
    if (orderBy) {
      idx = this._findInsertionLocation(inverseRecord, 0, len, orderBy);
    } else idx = len;

    storeIds.insertAt(idx, get(inverseRecord, 'id'));
    if (get(this, 'isMaster') && (record = get(this, 'record'))) {
      record.recordDidChange(get(this, 'propertyName'));
    }

    return this;
  },

  /** @private
      binary search to find insertion location
  */
  _findInsertionLocation: function(rec, min, max, orderBy) {
    var idx   = min+Math.floor((max-min)/2),
        cur   = this.objectAt(idx),
        order = this._compare(rec, cur, orderBy);
    if (order < 0) {
      if (idx===0) return idx;
      else return this._findInsertionLocation(rec, 0, idx, orderBy);
    } else if (order > 0) {
      if (idx >= max) return idx;
      else return this._findInsertionLocation(rec, idx, max, orderBy);
    } else return idx;
  },

  /** @private
      function to compare to objects
  */
  _compare: function(a, b, orderBy) {
    var t = SC.typeOf(orderBy),
        ret, idx, len;

    if (t === 'function') ret = orderBy(a, b);
    else if (t === 'string') ret = SC.compare(a,b);
    else {
      len = get(orderBy, 'length');
      ret = 0;
      for(idx=0;(ret===0) && (idx<len);idx++) ret = SC.compare(a,b);
    }

    return ret ;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private
    Invoked whenever the `storeIds` array changes.  Observes changes.
  */
  recordPropertyDidChange: function(keys) {

    if (keys && !keys.contains(get(this, 'propertyName'))) return this;

    var storeIds = get(this, 'readOnlyStoreIds'), oldLen, newLen;
    var prev = this._prevStoreIds, f = this._storeIdsContentDidChange;

    if (storeIds === prev) return this; // nothing to do

    if (prev) {
      prev.removeArrayObserver(this, {
        willChange: this.arrayWillChange,
        didChange: f
      });

      oldLen = get(prev, 'length');
    } else {
      oldLen = 0;
    }

    if (storeIds) {
      if(!storeIds.get("hasArrayObservers")) {
        storeIds.addArrayObserver(this, {
          willChange: this.arrayWillChange,
          didChange: f
        });
      }
      newLen = get(storeIds, 'length');
    } else {
      newLen = 0;
    }

    this.arrayContentWillChange(0, oldLen, newLen);
    this._prevStoreIds = storeIds;
    this._storeIdsContentDidChange(null, 0, oldLen, newLen);
  },

  arrayWillChange: function(item, start, removedCount, addedCount) {
    this.arrayContentWillChange(start, removedCount, addedCount);
  },

  /** @private
    Invoked whenever the content of the storeIds array changes.  This will
    dump any cached record lookup and then notify that the enumerable content
    has changed.
  */
  _storeIdsContentDidChange: function(item, start, removedCount, addedCount) {
    this._records = null ; // clear cache
    this.arrayContentDidChange(start, removedCount, addedCount);
  },

  /** @private */
  init: function() {
    this._super();
    this.recordPropertyDidChange();
  }

}) ;


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



var get = SC.get, set = SC.set;

/** @class

  ManyAttribute is a subclass of `RecordAttribute` and handles to-many
  relationships.

  When setting ( `set()` ) the value of a `toMany` attribute, make sure
  to pass in an array of `SC.Record` objects.

  There are many ways you can configure a `ManyAttribute`:

      contacts: SC.Record.toMany('MyApp.Contact', {
        inverse: 'group', // set the key used to represent the inverse
        isMaster: YES|NO, // indicate whether changing this should dirty
        transform: function(), // transforms value <=> storeKey,
        isEditable: YES|NO, make editable or not,
        through: 'taggings' // set a relationship this goes through
      });

  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.ManyAttribute = SC.RecordAttribute.extend(
  /** @scope SC.ManyAttribute.prototype */ {

  /**
    Set the foreign key on content objects that represent the inversion of
    this relationship. The inverse property should be a `toOne()` or
    `toMany()` relationship as well. Modifying this many array will modify
    the `inverse` property as well.

    @property {String}
  */
  inverse: null,

  /**
    If `YES` then modifying this relationships will mark the owner record
    dirty. If set to `NO`, then modifying this relationship will not alter
    this record.  You should use this property only if you have an inverse
    property also set. Only one of the inverse relationships should be marked
    as master so you can control which record should be committed.

    @property {Boolean}
  */
  isMaster: YES,

  /**
    If set and you have an inverse relationship, will be used to determine the
    order of an object when it is added to an array. You can pass a function
    or an array of property keys.

    @property {Function|Array}
  */
  orderBy: null,

  // ..........................................................
  // LOW-LEVEL METHODS
  //

  /**  @private - adapted for to many relationship */
  toType: function(record, key, value) {
    var type      = get(this, 'typeClass'),
        attrKey   = get(this, 'key') || key,
        arrayKey  = '__manyArray__'+SC.guidFor(this),
        ret       = record[arrayKey],
        rel;

    // lazily create a ManyArray one time.  after that always return the
    // same object.
    if (!ret) {
      ret = SC.ManyArray.create({
        recordType:    type,
        record:        record,
        propertyName:  attrKey,
        manyAttribute: this
      });

      record[arrayKey] = ret ; // save on record
      rel = get(record, 'relationships');
      if (!rel) set(record, 'relationships', rel = []);
      rel.push(ret); // make sure we get notified of changes...

    }

    return ret;
  },

  /** @private - adapted for to many relationship */
  fromType: function(record, key, value) {
    var ret = [];

    if(!SC.isArray(value)) throw "Expects toMany attribute to be an array";

    var len = get(value, 'length');
    for(var i=0;i<len;i++) {
      ret[i] = get(value.objectAt(i), 'id');
    }

    return ret;
  },

  /**
    Called by an inverse relationship whenever the receiver is no longer part
    of the relationship.  If this matches the inverse setting of the attribute
    then it will update itself accordingly.

    You should never call this directly.

    @param {SC.Record} the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was removed from inverse
    @param {String} key key on inverse that was modified
    @returns {void}
  */
  inverseDidRemoveRecord: function(record, key, inverseRecord, inverseKey) {
    var manyArray = get(record, key);
    if (manyArray) {
      manyArray.removeInverseRecord(inverseRecord);
    }
  },

  /**
    Called by an inverse relationship whenever the receiver is added to the
    inverse relationship.  This will set the value of this inverse record to
    the new record.

    You should never call this directly.

    @param {SC.Record} the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was added to inverse
    @param {String} key key on inverse that was modified
    @returns {void}
  */
  inverseDidAddRecord: function(record, key, inverseRecord, inverseKey) {
    var manyArray = get(record, key);
    if (manyArray) {
      manyArray.addInverseRecord(inverseRecord);
    }
  }

});


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var get = SC.get, set = SC.set;
var RecordAttribute_call = get(SC.RecordAttribute, 'proto').call;
var attrFor = SC.RecordAttribute.attrFor;

/** @class

  `SingleAttribute` is a subclass of `RecordAttribute` and handles to-one
  relationships.

  There are many ways you can configure a `SingleAttribute`:

      group: SC.Record.toOne('MyApp.Group', {
        inverse: 'contacts', // set the key used to represent the inverse
        isMaster: YES|NO, // indicate whether changing this should dirty
        transform: function(), // transforms value <=> storeKey,
        isEditable: YES|NO, make editable or not
      });

  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.SingleAttribute = SC.RecordAttribute.extend(
  /** @scope SC.SingleAttribute.prototype */ {

  /**
    Specifies the property on the member record that represents the inverse
    of the current relationship.  If set, then modifying this relationship
    will also alter the opposite side of the relationship.

    @type String
    @default null
  */
  inverse: null,

  /**
    If set, determines that when an inverse relationship changes whether this
    record should become dirty also or not.

    @type Boolean
    @default YES
  */
  isMaster: YES,


  /**
    @private - implements support for handling inverse relationships.
  */
  call: function(record, key, newRec) {
    var attrKey = get(this, 'key') || key,
        inverseKey, isMaster, oldRec, attr, ret, nvalue;

    // WRITE
    if (newRec !== undefined && get(this, 'isEditable')) {

      // can only take other records or null
      if (newRec && !(newRec instanceof  SC.Record)) {
        throw "%@ is not an instance of SC.Record".fmt(newRec);
      }

      inverseKey = get(this, 'inverse');
      if (inverseKey) oldRec = this._super(record, key);

      // careful: don't overwrite value here.  we want the return value to
      // cache.
      nvalue = this.fromType(record, key, newRec) ; // convert to attribute.
      record.writeAttribute(attrKey, nvalue, !get(this, 'isMaster'));
      ret = newRec ;

      // ok, now if we have an inverse relationship, get the inverse
      // relationship and notify it of what is happening.  This will allow it
      // to update itself as needed.  The callbacks implemented here are
      // supported by both SingleAttribute and ManyAttribute.
      //
      if (inverseKey && (oldRec !== newRec)) {
        if (oldRec && (attr = attrFor(oldRec, inverseKey))) {
          attr.inverseDidRemoveRecord(oldRec, inverseKey, record, key);
        }

        if (newRec && (attr = attrFor(newRec, inverseKey))) {
          attr.inverseDidAddRecord(newRec, inverseKey, record, key);
        }
      }

    // READ
    } else ret = this._super(record, key, newRec);

    return ret ;
  },

  /**
    Called by an inverse relationship whenever the receiver is no longer part
    of the relationship.  If this matches the inverse setting of the attribute
    then it will update itself accordingly.

    @param {SC.Record} record the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was removed from inverse
    @param {String} inverseKey key on inverse that was modified
  */
  inverseDidRemoveRecord: function(record, key, inverseRecord, inverseKey) {

    var myInverseKey  = get(this, 'inverse'),
        curRec   = RecordAttribute_call.call(this, record, key),
        isMaster = get(this, 'isMaster'), attr;

    // ok, you removed me, I'll remove you...  if isMaster, notify change.
    record.writeAttribute(key, null, !isMaster);
    record.notifyPropertyChange(key);

    // if we have another value, notify them as well...
    if ((curRec !== inverseRecord) || (inverseKey !== myInverseKey)) {
      if (curRec && (attr = attrFor(curRec, myInverseKey))) {
        attr.inverseDidRemoveRecord(curRec, myInverseKey, record, key);
      }
    }
  },

  /**
    Called by an inverse relationship whenever the receiver is added to the
    inverse relationship.  This will set the value of this inverse record to
    the new record.

    @param {SC.Record} record the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was added to inverse
    @param {String} inverseKey key on inverse that was modified
  */
  inverseDidAddRecord: function(record, key, inverseRecord, inverseKey) {

    var myInverseKey  = get(this, 'inverse'),
        curRec   = RecordAttribute_call.call(this, record, key),
        isMaster = get(this, 'isMaster'),
        attr, nvalue;

    // ok, replace myself with the new value...
    nvalue = this.fromType(record, key, inverseRecord); // convert to attr.
    record.writeAttribute(key, nvalue, !isMaster);
    record.notifyPropertyChange(key);

    // if we have another value, notify them as well...
    if ((curRec !== inverseRecord) || (inverseKey !== myInverseKey)) {
      if (curRec && (attr = attrFor(curRec, myInverseKey))) {
        attr.inverseDidRemoveRecord(curRec, myInverseKey, record, key);
      }
    }
  }

});


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore DataStore
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================





})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Indicates a value has a mixed state of both on and off.

  @property {String}
*/
SC.MIXED_STATE = '__MIXED__';

/** @class

  A DataSource connects an in-memory store to one or more server backends.
  To connect to a data backend on a server, subclass `SC.DataSource`
  and implement the necessary data source methods to communicate with the
  particular backend.

  ## Create a Data Source

  To implement the data source, subclass `SC.DataSource` in a file located
  either in the root level of your app or framework, or in a directory
  called "data_sources":

      MyApp.DataSource = SC.DataSource.extend({
        // implement the data source API...
      });

  ## Connect to a Data Source

  New SproutCore applications are wired up to fixtures as their data source.
  When you are ready to connect to a server, swap the use of fixtures with a
  call to the desired data source.

  In core.js:

      // change...
      store: SC.Store.create().from(SC.Record.fixtures)

      // to...
      store: SC.Store.create().from('MyApp.DataSource')

  Note that the data source class name is referenced by string since the file
  in which it is defined may not have been loaded yet. The first time a
  data store tries to access its data source it will look up the class name
  and instantiate that data source.

  ## Implement the Data Source API

  There are three methods that a data store invokes on its data source:

   * `fetch()` &mdash; called the first time you try to `find()` a query
     on a store or any time you refresh the record array after that.
   * `retrieveRecords()` &mdash; called when you access an individual
     record that has not been loaded yet
   * `commitRecords()` &mdash; called if the the store has changes
     pending and its `commitRecords()` method is invoked.

  The data store will call the `commitRecords()` method when records
  need to be created, updated, or deleted. If the server that the data source
  connects to handles these three actions in a uniform manner, it may be
  convenient to implement the `commitRecords()` to handle record
  creation, updating, and deletion.

  However, if the calls the data source will need to make to the server to
  create, update, and delete records differ from each other to a significant
  enough degree, it will be more convenient to rely on the default behavior
  of `commitRecords()` and instead implement the three methods that
  it will call by default:

   * `createRecords()` &mdash; called with a list of records that are new
     and need to be created on the server.
   * `updateRecords()` &mdash; called with a list of records that already
      exist on the server but that need to be updated.
   * `destroyRecords()` &mdash; called with a list of records that should
     be deleted on the server.

  ### Multiple records

  The `retrieveRecords()`, `createRecords()`, `updateRecords()` and
  `destroyRecords()` methods all work on multiple records. If your server
  API accommodates calls where you can  pass a list of records, this might
  be the best level at which to implement the Data Source API. On the other
  hand, if the server requires that you send commands for it for individual
  records, you can rely on the default implementation of these four methods,
  which will call the following for each individual record, one at a time:

   - `retrieveRecord()` &mdash; called to retrieve a single record.
   - `createRecord()` &mdash; called to create a single record.
   - `updateRecord()` &mdash; called to update a single record.
   - `destroyRecord()` &mdash; called to destroy a single record.


  ### Return Values

  All of the methods you implement must return one of three values:
   - `YES` &mdash; all the records were handled.
   - `NO` &mdash; none of the records were handled.
   - `SC.MIXED_STATE` &mdash; some, but not all of the records were handled.


  ### Store Keys

  Whenever a data store invokes one of the data source methods it does so
  with a storeKeys or storeKey argument. Store keys are transient integers
  assigned to each data hash when it is first loaded into the store. It is
  used to track data hashes as they move up and down nested stores (even if
  no associated record is ever created from it).

  When passed a storeKey you can use it to retrieve the status, data hash,
  record type, or record ID, using the following data store methods:

   * `readDataHash(storeKey)` &mdash; returns the data hash associated with
     a store key, if any.
   * `readStatus(storeKey)` &mdash; returns the current record status
     associated with the store key. May be `SC.Record.EMPTY`.
   * `SC.Store.recordTypeFor(storeKey)` &mdash; returns the record type for
     the associated store key.
   * `recordType.idFor(storeKey)` &mdash; returns the record ID for
     the associated store key. You must call this method on `SC.Record`
     subclass itself, not on an instance of `SC.Record`.

  These methods are safe for reading data from the store. To modify data
  in the data store you must use the store callbacks described below. The
  store callbacks will ensure that the record states remain consistent.

  ### Store Callbacks

  When a data store calls a data source method, it puts affected records into
  a `BUSY` state. To guarantee data integrity and consistency, these records
  cannot be modified by the rest of the application while they are in the `BUSY`
  state.

  Because records are "locked" while in the `BUSY` state, it is the data source's
  responsibility to invoke a callback on the store for each record or query that
  was passed to it and that the data source handled. To reduce the amount of work
  that a data source must do, the data store will automatically unlock the relevant
  records if the the data source method returned `NO`, indicating that the records
  were unhandled.

  Although a data source can invoke callback methods at any time, they should
  usually be invoked after receiving a response from the server. For example, when
  the data source commits a change to a record by issuing a command to the server,
  it waits for the server to acknowledge the command before invoking the
  `dataSourceDidComplete()` callback.

  In some cases a data source may be able to assume a server's response and invoke
  the callback on the store immediately. This can improve performance because the
  record can be unlocked right away.


  ### Record-Related Callbacks

  When `retrieveRecords()`, `commitRecords()`, or any of the related methods are
  called on a data source, the store puts any records to be handled by the data
  store in a `BUSY` state. To release the records the data source must invoke one
  of the record-related callbacks on the store:

   * `dataSourceDidComplete(storeKey, dataHash, id)` &mdash; the most common
     callback. You might use this callback when you have retrieved a record to
     load its contents into the store. The callback tells the store that the data
     source is finished with the storeKey in question. The `dataHash` and `id`
     arguments are optional and will replace the current dataHash and/or id. Also
     see "Loading Records" below.
   * `dataSourceDidError(storeKey, error)` &mdash; a data source should call this
     when a request could not be completed because an error occurred. The error
     argument is optional and can contain more information about the error.
   * `dataSourceDidCancel(storeKey)` &mdash; a data source should call this when
     an operation is cancelled for some reason. This could be used when the user
     is able to cancel an operation that is in progress.

  ### Loading Records into the Store

  Instead of orchestrating multiple `dataSourceDidComplete()` callbacks when loading
  multiple records, a data source can call the `loadRecords()` method on the store,
  passing in a `recordType`, and array of data hashes, and optionally an array of ids.
  The `loadRecords()` method takes care of looking up storeKeys and calling the
  `dataSourceDidComplete()` callback as needed.

  `loadRecords()` is often the most convenient way to get large blocks of data into
  the store, especially in response to a `fetch()` or `retrieveRecords()` call.


  ### Query-Related Callbacks

  Like records, queries that are passed through the `fetch()` method also have an
  associated status property; accessed through the `status`  property on the record
  array returned from `find()`. To properly reset this status, a data source must
  invoke an appropriate query-related callback on the store. The callbacks for
  queries are similar to those for records:

   * `dataSourceDidFetchQuery(query)` &mdash; the data source must call this when
     it has completed fetching any related data for the query. This returns the
     query results (record array) status into a `READY` state.
   * `dataSourceDidErrorQuery(query, error)` &mdash; the data source should call
     this if it encounters an error in executing the query. This puts the query
     results into an `ERROR` state.
   * `dataSourceDidCancelQuery(query)` &mdash; the data source should call this
     if loading the results is cancelled.

  In addition to these callbacks, the method `loadQueryResults(query, storeKey)`
  is used by data sources when handling remote queries. This method is similar to
  `dataSourceDidFetchQuery()`, except that you also provide an array of storeKeys
  (or a promise to provide store keys) that comprises the result set.

  @extend SC.Object
  @since SproutCore 1.0
*/
SC.DataSource = SC.Object.extend( /** @scope SC.DataSource.prototype */ {

  // ..........................................................
  // SC.STORE ENTRY POINTS
  //


  /**

    Invoked by the store whenever it needs to retrieve data matching a
    specific query, triggered by find().  This method is called anytime
    you invoke SC.Store#find() with a query or SC.RecordArray#refresh().  You
    should override this method to actually retrieve data from the server
    needed to fulfill the query.  If the query is a remote query, then you
    will also need to provide the contents of the query as well.

    ### Handling Local Queries

    Most queries you create in your application will be local queries.  Local
    queries are populated automatically from whatever data you have in memory.
    When your fetch() method is called on a local queries, all you need to do
    is load any records that might be matched by the query into memory.

    The way you choose which queries to fetch is up to you, though usually it
    can be something fairly straightforward such as loading all records of a
    specified type.

    When you finish loading any data that might be required for your query,
    you should always call SC.Store#dataSourceDidFetchQuery() to put the query
    back into the READY state.  You should call this method even if you choose
    not to load any new data into the store in order to notify that the store
    that you think it is ready to return results for the query.

    ### Handling Remote Queries

    Remote queries are special queries whose results will be populated by the
    server instead of from memory.  Usually you will only need to use this
    type of query when loading large amounts of data from the server.

    Like Local queries, to fetch a remote query you will need to load any data
    you need to fetch from the server and add the records to the store.  Once
    you are finished loading this data, however, you must also call
    SC.Store#loadQueryResults() to actually set an array of storeKeys that
    represent the latest results from the server.  This will implicitly also
    call datasSourceDidFetchQuery() so you don't need to call this method
    yourself.

    If you want to support incremental loading from the server for remote
    queries, you can do so by passing a SC.SparseArray instance instead of
    a regular array of storeKeys and then populate the sparse array on demand.

    ### Handling Errors and Cancelations

    If you encounter an error while trying to fetch the results for a query
    you can call SC.Store#dataSourceDidErrorQuery() instead.  This will put
    the query results into an error state.

    If you had to cancel fetching a query before the results were returned,
    you can instead call SC.Store#dataSourceDidCancelQuery().  This will set
    the query back into the state it was in previously before it started
    loading the query.

    ### Return Values

    When you return from this method, be sure to return a Boolean.  YES means
    you handled the query, NO means you can't handle the query.  When using
    a cascading data source, returning NO will mean the next data source will
    be asked to fetch the same results as well.

    @param {SC.Store} store the requesting store
    @param {SC.Query} query query describing the request
    @returns {Boolean} YES if you can handle fetching the query, NO otherwise
  */
  fetch: function(store, query) {
    return NO ; // do not handle anything!
  },

  /**
    Called by the store whenever it needs to load a specific set of store
    keys.  The default implementation will call retrieveRecord() for each
    storeKey.

    You should implement either retrieveRecord() or retrieveRecords() to
    actually fetch the records referenced by the storeKeys .

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys
    @param {Array} ids - optional
    @returns {Boolean} YES if handled, NO otherwise
  */
  retrieveRecords: function(store, storeKeys, ids) {
    return this._handleEach(store, storeKeys, this.retrieveRecord, ids);
  },

  /**
    Invoked by the store whenever it has one or more records with pending
    changes that need to be sent back to the server.  The store keys will be
    separated into three categories:

     - `createStoreKeys`: records that need to be created on server
     - `updateStoreKeys`: existing records that have been modified
     - `destroyStoreKeys`: records need to be destroyed on the server

    If you do not override this method yourself, this method will actually
    invoke `createRecords()`, `updateRecords()`, and `destroyRecords()` on the
    dataSource, passing each array of storeKeys.  You can usually implement
    those methods instead of overriding this method.

    However, if your server API can sync multiple changes at once, you may
    prefer to override this method instead.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle any of the keys, `YES` if you can handle all of the keys, or
    `SC.MIXED_STATE` if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} createStoreKeys keys to create
    @param {Array} updateStoreKeys keys to update
    @param {Array} destroyStoreKeys keys to destroy
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if data source can handle keys
  */
  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys, params) {
    var uret, dret, ret;
    if (createStoreKeys.length>0) {
      ret = this.createRecords.call(this, store, createStoreKeys, params);
    }

    if (updateStoreKeys.length>0) {
      uret = this.updateRecords.call(this, store, updateStoreKeys, params);
      ret = SC.none(ret) ? uret : (ret === uret) ? ret : SC.MIXED_STATE;
    }

    if (destroyStoreKeys.length>0) {
      dret = this.destroyRecords.call(this, store, destroyStoreKeys, params);
      ret = SC.none(ret) ? dret : (ret === dret) ? ret : SC.MIXED_STATE;
    }

    return ret || NO;
  },

  /**
    Invoked by the store whenever it needs to cancel one or more records that
    are currently in-flight.  If any of the storeKeys match records you are
    currently acting upon, you should cancel the in-progress operation and
    return `YES`.

    If you implement an in-memory data source that immediately services the
    other requests, then this method will never be called on your data source.

    To support cascading data stores, be sure to return `NO` if you cannot
    retrieve any of the keys, `YES` if you can retrieve all of the, or
    `SC.MIXED_STATE` if you can retrieve some of the.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys array of storeKeys to retrieve
    @returns {Boolean} YES if data source can handle keys
  */
  cancel: function(store, storeKeys) {
    return NO;
  },

  // ..........................................................
  // BULK RECORD ACTIONS
  //

  /**
    Called from `commitRecords()` to commit modified existing records to the
    store.  You can override this method to actually send the updated
    records to your store.  The default version will simply call
    `updateRecord()` for each storeKey.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle any of the keys, `YES` if you can handle all of the keys, or
    `SC.MIXED_STATE` if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys keys to update
    @param {Hash} params
      to be passed down to data source. originated from the commitRecords()
      call on the store

    @returns {Boolean} YES, NO, or SC.MIXED_STATE

  */
  updateRecords: function(store, storeKeys, params) {
    return this._handleEach(store, storeKeys, this.updateRecord, null, params);
  },

  /**
    Called from `commitRecords()` to commit newly created records to the
    store.  You can override this method to actually send the created
    records to your store.  The default version will simply call
    `createRecord()` for each storeKey.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle any of the keys, `YES` if you can handle all of the keys, or
    `SC.MIXED_STATE` if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys keys to update

    @param {Hash} params
      to be passed down to data source. originated from the commitRecords()
      call on the store

    @returns {Boolean} YES, NO, or SC.MIXED_STATE

  */
  createRecords: function(store, storeKeys, params) {
    return this._handleEach(store, storeKeys, this.createRecord, null, params);
  },

  /**
    Called from `commitRecords()` to commit destroted records to the
    store.  You can override this method to actually send the destroyed
    records to your store.  The default version will simply call
    `destroyRecord()` for each storeKey.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle any of the keys, `YES` if you can handle all of the keys, or
    `SC.MIXED_STATE` if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys keys to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store

    @returns {Boolean} YES, NO, or SC.MIXED_STATE

  */
  destroyRecords: function(store, storeKeys, params) {
    return this._handleEach(store, storeKeys, this.destroyRecord, null, params);
  },

  /** @private
    invokes the named action for each store key.  returns proper value
  */
  _handleEach: function(store, storeKeys, action, ids, params) {
    var len = storeKeys.length, idx, ret, cur, idOrParams;

    for(idx=0;idx<len;idx++) {
      idOrParams = ids ? ids[idx] : params;

      cur = action.call(this, store, storeKeys[idx], idOrParams);
      if (ret === undefined) {
        ret = cur ;
      } else if (ret === YES) {
        ret = (cur === YES) ? YES : SC.MIXED_STATE ;
      } else if (ret === NO) {
        ret = (cur === NO) ? NO : SC.MIXED_STATE ;
      }
    }
    return !SC.none(ret) ? ret : null ;
  },


  // ..........................................................
  // SINGLE RECORD ACTIONS
  //

  /**
    Called from `updatesRecords()` to update a single record.  This is the
    most basic primitive to can implement to support updating a record.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle the passed storeKey or `YES` if you can.

    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if handled
  */
  updateRecord: function(store, storeKey, params) {
    return NO ;
  },

  /**
    Called from `retrieveRecords()` to retrieve a single record.

    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to retrieve
    @param {String} id the id to retrieve
    @returns {Boolean} YES if handled
  */
  retrieveRecord: function(store, storeKey, id) {
    return NO ;
  },

  /**
    Called from `createdRecords()` to created a single record.  This is the
    most basic primitive to can implement to support creating a record.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle the passed storeKey or `YES` if you can.

    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if handled
  */
  createRecord: function(store, storeKey, params) {
    return NO ;
  },

  /**
    Called from `destroyRecords()` to destroy a single record.  This is the
    most basic primitive to can implement to support destroying a record.

    To support cascading data stores, be sure to return `NO` if you cannot
    handle the passed storeKey or `YES` if you can.

    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if handled
  */
  destroyRecord: function(store, storeKey, params) {
    return NO ;
  }

});


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


var get = SC.get, set = SC.set;

/** @class

  A cascading data source will actually forward requests onto an array of
  additional data sources, stopping when one of the data sources returns YES,
  indicating that it handled the request.

  You can use a cascading data source to tie together multiple data sources,
  treating them as a single namespace.

  ## Configuring a Cascade Data Source

  You will usually define your cascading data source in your main method after
  all the classes you have are loaded.

      MyApp.dataSource = SC.CascadeDataSource.create({
        dataSources: "prefs youtube photos".w(),

        prefs:   MyApp.PrefsDataSource.create({ root: "/prefs" }),
        youtube: YouTube.YouTubeDataSource.create({ apiKey: "123456" }),
        photos:  MyApp.PhotosDataSource.create({ root: "photos" })

      });

      set(MyApp.store, 'dataSource', MyApp.dataSource);

  Note that the order you define your dataSources property will determine the
  order in which requests will cascade from the store.

  Alternatively, you can use a more jQuery-like API for defining your data
  sources:

      MyApp.dataSource = SC.CascadeDataSource.create()
        .from(MyApp.PrefsDataSource.create({ root: "/prefs" }))
        .from(YouTube.YouTubeDataSource.create({ apiKey: "123456" }))
        .from(MyApp.PhotosDataSource.create({ root: "photos" }));

      set(MyApp.store, 'dataSource', MyApp.dataSource);

  In this case, the order you call from() will determine the order the request
  will cascade.

  @extends SC.DataSource
  @since SproutCore 1.0
*/
SC.CascadeDataSource = SC.DataSource.extend(
  /** @scope SC.CascadeDataSource.prototype */ {

  /**
    The data sources used by the cascade, in the order that they are to be
    followed.  Usually when you define the cascade, you will define this
    array.

    @property {Array}
  */
  dataSources: null,

  /**
    Add a data source to the list of sources to use when cascading.  Used to
    build the data source cascade effect.

    @param {SC.DataSource} dataSource a data source instance to add.
    @returns {SC.CascadeDataSource} receiver
  */
  from: function(dataSource) {
    var dataSources = get(this, 'dataSources');
    if (!dataSources) set(this, 'dataSources', dataSources = []);
    dataSources.push(dataSource);
    return this ;
  },

  // ..........................................................
  // SC.STORE ENTRY POINTS
  //

  /** @private - just cascades */
  fetch: function(store, query) {
    var sources = get(this, 'dataSources'),
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;

    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.fetch ? source.fetch.apply(source, arguments) : NO;
      ret = this._handleResponse(ret, cur);
    }

    return ret ;
  },


  /** @private - just cascades */
  retrieveRecords: function(store, storeKeys, ids) {
    var sources = get(this, 'dataSources'),
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;

    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.retrieveRecords.apply(source, arguments);
      ret = this._handleResponse(ret, cur);
    }

    return ret ;
  },

  /** @private - just cascades */
  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys, params) {
    var sources = get(this, 'dataSources'),
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;

    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.commitRecords.apply(source, arguments);
      ret = this._handleResponse(ret, cur);
    }

    return ret ;
  },

  /** @private - just cascades */
  cancel: function(store, storeKeys) {
    var sources = get(this, 'dataSources'),
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;

    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.cancel.apply(source, arguments);
      ret = this._handleResponse(ret, cur);
    }

    return ret ;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  init: function() {
    this._super();

    // if a dataSources array is defined, look for any strings and lookup
    // the same on the data source.  Replace.
    var sources = get(this, 'dataSources'),
        idx     = sources ? get(sources, 'length') : 0,
        source;
    while(--idx>=0) {
      source = sources[idx];
      if (SC.typeOf(source) === 'string') sources[idx] = get(this, source);
    }

  },

  /** @private - Determine the proper return value. */
  _handleResponse: function(current, response) {
    if (response === YES) return YES ;
    else if (current === NO) return (response === NO) ? NO : SC.MIXED_STATE ;
    else return SC.MIXED_STATE ;
  }

});


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================




var get = SC.get, set = SC.set, getPath = SC.getPath;

/** @class

  TODO: Describe Class

  @extends SC.DataSource
  @since SproutCore 1.0
*/
SC.FixturesDataSource = SC.DataSource.extend(
  /** @scope SC.FixturesDataSource.prototype */ {

  /**
    If YES then the data source will asynchronously respond to data requests
    from the server.  If you plan to replace the fixture data source with a
    data source that talks to a real remote server (using Ajax for example),
    you should leave this property set to YES so that Fixtures source will
    more accurately simulate your remote data source.

    If you plan to replace this data source with something that works with
    local storage, for example, then you should set this property to NO to
    accurately simulate the behavior of your actual data source.

    @property {Boolean}
  */
  simulateRemoteResponse: NO,

  /**
    If you set simulateRemoteResponse to YES, then the fixtures source will
    assume a response latency from your server equal to the msec specified
    here.  You should tune this to simulate latency based on the expected
    performance of your server network.  Here are some good guidelines:

     - 500: Simulates a basic server written in PHP, Ruby, or Python (not twisted) without a CDN in front for caching.
     - 250: (Default) simulates the average latency needed to go back to your origin server from anywhere in the world.  assumes your servers itself will respond to requests < 50 msec
     - 100: simulates the latency to a "nearby" server (i.e. same part of the world).  Suitable for simulating locally hosted servers or servers with multiple data centers around the world.
     - 50: simulates the latency to an edge cache node when using a CDN.  Life is really good if you can afford this kind of setup.

    @property {Number}
  */
  latency: 50,

  // ..........................................................
  // CANCELLING
  //

  /** @private */
  cancel: function(store, storeKeys) {
    return NO;
  },


  // ..........................................................
  // FETCHING
  //

  /** @private */
  fetch: function(store, query) {

    // can only handle local queries out of the box
    if (get(query, 'location') !== SC.Query.LOCAL) {
      throw SC.$error('SC.Fixture data source can only fetch local queries');
    }

    if (!get(query, 'recordType') && !get(query, 'recordTypes')) {
      throw SC.$error('SC.Fixture data source can only fetch queries with one or more record types');
    }

    if (get(this, 'simulateRemoteResponse')) {
      var self = this;
      setTimeout(function() {
        self._fetch(store, query);
      }, get(this, 'latency'));

    } else this._fetch(store, query);
  },

  /** @private
    Actually performs the fetch.
  */
  _fetch: function(store, query) {

    // NOTE: Assumes recordType or recordTypes is defined.  checked in fetch()
    var recordType = get(query, 'recordType'),
        recordTypes = get(query, 'recordTypes') || [recordType];

    // load fixtures for each recordType
    recordTypes.forEach(function(recordType) {
      if (SC.typeOf(recordType) === 'string') {
        recordType = getPath(recordType);
      }

      if (recordType) this.loadFixturesFor(store, recordType);
    }, this);

    // notify that query has now loaded - puts it into a READY state
    store.dataSourceDidFetchQuery(query);
  },

  // ..........................................................
  // RETRIEVING
  //

  /** @private */
  retrieveRecords: function(store, storeKeys) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = get(this, 'latency'),
        ret     = this.hasFixturesFor(storeKeys) ;
    if (!ret) return ret ;

    if (get(this, 'simulateRemoteResponse')) {
      var self = this;
      setTimeout(function() {
        self._retrieveRecords(store, storeKeys);
      }, latency);
    } else this._retrieveRecords(store, storeKeys);

    return ret ;
  },

  _retrieveRecords: function(store, storeKeys) {

    storeKeys.forEach(function(storeKey) {
      var ret        = [],
          recordType = SC.Store.recordTypeFor(storeKey),
          id         = store.idFor(storeKey),
          hash       = this.fixtureForStoreKey(store, storeKey);
      ret.push(storeKey);
      store.dataSourceDidComplete(storeKey, hash, id);
    }, this);
  },

  // ..........................................................
  // UPDATE
  //

  /** @private */
  updateRecords: function(store, storeKeys, params) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = get(this, 'latency'),
        ret     = this.hasFixturesFor(storeKeys) ;
    if (!ret) return ret ;

    if (get(this, 'simulateRemoteResponse')) {
      var self = this;
      setTimeout(function() {
        self._updateRecords(store, storeKeys);
      }, latency);
    } else this._updateRecords(store, storeKeys);

    return ret ;
  },

  _updateRecords: function(store, storeKeys) {
    storeKeys.forEach(function(storeKey) {
      var hash = store.readDataHash(storeKey);
      this.setFixtureForStoreKey(store, storeKey, hash);
      store.dataSourceDidComplete(storeKey);
    }, this);
  },


  // ..........................................................
  // CREATE RECORDS
  //

  /** @private */
  createRecords: function(store, storeKeys, params) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = get(this, 'latency');

    if (get(this, 'simulateRemoteResponse')) {
      var self = this;
      setTimeout(function() {
        self._createRecords(store, storeKeys);
      }, latency);
    } else this._createRecords(store, storeKeys);

    return YES ;
  },

  _createRecords: function(store, storeKeys) {
    storeKeys.forEach(function(storeKey) {
      var id         = store.idFor(storeKey),
          recordType = store.recordTypeFor(storeKey),
          dataHash   = store.readDataHash(storeKey),
          fixtures   = this.fixturesFor(recordType);

      if (!id) id = this.generateIdFor(recordType, dataHash, store, storeKey);
      this._invalidateCachesFor(recordType, storeKey, id);
      fixtures[id] = dataHash;

      store.dataSourceDidComplete(storeKey, null, id);
    }, this);
  },

  // ..........................................................
  // DESTROY RECORDS
  //

  /** @private */
  destroyRecords: function(store, storeKeys, params) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = get(this, 'latency'),
        ret     = this.hasFixturesFor(storeKeys) ;
    if (!ret) return ret ;

    if (get(this, 'simulateRemoteResponse')) {
      var self;
      setTimeout(function() {
        self._destroyRecords(store, storeKeys);
      }, latency);
    } else this._destroyRecords(store, storeKeys);

    return ret ;
  },


  _destroyRecords: function(store, storeKeys) {
    storeKeys.forEach(function(storeKey) {
      var id         = store.idFor(storeKey),
          recordType = store.recordTypeFor(storeKey),
          fixtures   = this.fixturesFor(recordType);

      this._invalidateCachesFor(recordType, storeKey, id);
      if (id) delete fixtures[id];
      store.dataSourceDidDestroy(storeKey);
    }, this);
  },

  // ..........................................................
  // INTERNAL METHODS/PRIMITIVES
  //

  /**
    Load fixtures for a given fetchKey into the store
    and push it to the ret array.

    @param {SC.Store} store the store to load into
    @param {SC.Record} recordType the record type to load
    @param {SC.Array} ret is passed, array to add loaded storeKeys to.
    @returns {SC.Fixture} receiver
  */
  loadFixturesFor: function(store, recordType, ret) {
    var hashes   = [],
        dataHashes, i, storeKey ;

    dataHashes = this.fixturesFor(recordType);

    for(i in dataHashes){
      storeKey = recordType.storeKeyFor(i);
      if (store.peekStatus(storeKey) === SC.Record.EMPTY) {
        hashes.push(dataHashes[i]);
      }
      if (ret) ret.push(storeKey);
    }

    // only load records that were not already loaded to avoid infinite loops
    if (hashes && hashes.length>0) store.loadRecords(recordType, hashes);

    return this ;
  },


  /**
    Generates an id for the passed record type.  You can override this if
    needed.  The default generates a storekey and formats it as a string.

    @param {Class} recordType Subclass of SC.Record
    @param {Hash} dataHash the data hash for the record
    @param {SC.Store} store the store
    @param {Number} storeKey store key for the item
    @returns {String}
  */
  generateIdFor: function(recordType, dataHash, store, storeKey) {
    return "@id%@".fmt(SC.Store.generateStoreKey());
  },

  /**
    Based on the storeKey it returns the specified fixtures

    @param {SC.Store} store the store
    @param {Number} storeKey the storeKey
    @returns {Hash} data hash or null
  */
  fixtureForStoreKey: function(store, storeKey) {
    var id         = store.idFor(storeKey),
        recordType = store.recordTypeFor(storeKey),
        fixtures   = this.fixturesFor(recordType);
    return fixtures ? fixtures[id] : null;
  },

  /**
    Update the data hash fixture for the named store key.

    @param {SC.Store} store the store
    @param {Number} storeKey the storeKey
    @param {Hash} dataHash
    @returns {SC.FixturesDataSource} receiver
  */
  setFixtureForStoreKey: function(store, storeKey, dataHash) {
    var id         = store.idFor(storeKey),
        recordType = store.recordTypeFor(storeKey),
        fixtures   = this.fixturesFor(recordType);
    this._invalidateCachesFor(recordType, storeKey, id);
    fixtures[id] = dataHash;
    return this ;
  },

  /**
    Get the fixtures for the passed record type and prepare them if needed.
    Return cached value when complete.

    @param {SC.Record} recordType
    @returns {Hash} data hashes
  */
  fixturesFor: function(recordType) {
    // get basic fixtures hash.
    if (!this._fixtures) this._fixtures = {};
    var fixtures = this._fixtures[SC.guidFor(recordType)];
    if (fixtures) return fixtures ;

    // need to load fixtures.
    var dataHashes = recordType ? recordType.FIXTURES : null,
        len        = dataHashes ? dataHashes.length : 0,
        primaryKey = recordType ? get(recordType, 'proto').primaryKey:'guid',
        idx, dataHash, id ;

    this._fixtures[SC.guidFor(recordType)] = fixtures = {} ;
    for(idx=0;idx<len;idx++) {
      dataHash = dataHashes[idx];
      id = dataHash[primaryKey];
      if (!id) id = this.generateIdFor(recordType, dataHash);
      fixtures[id] = dataHash;
    }
    return fixtures;
  },

  /**
    Returns YES if fixtures for a given recordType have already been loaded

    @param {SC.Record} recordType
    @returns {Boolean} storeKeys
  */
  fixturesLoadedFor: function(recordType) {
    if (!this._fixtures) return NO;
    var ret = [], fixtures = this._fixtures[SC.guidFor(recordType)];
    return fixtures ? YES: NO;
  },

  /**
    Returns YES or SC.MIXED_STATE if one or more of the storeKeys can be
    handled by the fixture data source.

    @param {Array} storeKeys the store keys
    @returns {Boolean} YES if all handled, MIXED_STATE if some handled
  */
  hasFixturesFor: function(storeKeys) {
    var ret = NO ;
    storeKeys.forEach(function(storeKey) {
      if (ret !== SC.MIXED_STATE) {
        var recordType = SC.Store.recordTypeFor(storeKey),
            fixtures   = recordType ? recordType.FIXTURES : null ;
        if (fixtures && fixtures.length && fixtures.length>0) {
          if (ret === NO) ret = YES ;
        } else if (ret === YES) ret = SC.MIXED_STATE ;
      }
    }, this);

    return ret ;
  },

  /** @private
    Invalidates any internal caches based on the recordType and optional
    other parameters.  Currently this only invalidates the storeKeyCache used
    for fetch, but it could invalidate others later as well.

    @param {SC.Record} recordType the type of record modified
    @param {Number} storeKey optional store key
    @param {String} id optional record id
    @returns {SC.FixturesDataSource} receiver
  */
  _invalidateCachesFor: function(recordType, storeKey, id) {
    var cache = this._storeKeyCache;
    if (cache) delete cache[SC.guidFor(recordType)];
    return this ;
  }

});

/**
  Default fixtures instance for use in applications.

  @property {SC.FixturesDataSource}
*/
SC.Record.fixtures = SC.FixturesDataSource.create();


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore DataStore
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================




var get = SC.get, set = SC.set;

/**
  @class

  A `RecordArray` wraps an array of `storeKeys` and, optionally, a `Query`
  object. When you access the items of a `RecordArray`, it will automatically
  convert the `storeKeys` into actual `SC.Record` objects that the rest of
  your application can work with.

  Normally you do not create `RecordArray`s yourself.  Instead, a
  `RecordArray` is returned when you call `SC.Store.findAll()`, already
  properly configured. You can usually just work with the `RecordArray`
  instance just like any other array.

  The information below about `RecordArray` internals is only intended for
  those who need to override this class for some reason to do something
  special.

  Internal Notes
  ---

  Normally the `RecordArray` behavior is very simple.  Any array-like
  operations will be translated into similar calls onto the underlying array
  of `storeKeys`.  The underlying array can be a real array or it may be a
  `SparseArray`, which is how you implement incremental loading.

  If the `RecordArray` is created with an `SC.Query` object as well (and it
  almost always will have a `Query` object), then the `RecordArray` will also
  consult the query for various delegate operations such as determining if
  the record array should update automatically whenever records in the store
  changes. It will also ask the `Query` to refresh the `storeKeys` whenever
  records change in the store.

  If the `SC.Query` object has complex matching rules, it might be
  computationally heavy to match a large dataset to a query. To avoid the
  browser from ever showing a slow script timer in this scenario, the query
  matching is by default paced at 100ms. If query matching takes longer than
  100ms, it will chunk the work with setTimeout to avoid too much computation
  to happen in one runloop.


  @extends SC.Object
  @extends SC.Enumerable
  @extends SC.Array
  @since SproutCore 1.0
*/

SC.RecordArray = SC.Object.extend(SC.Enumerable, SC.Array, SC.MutableEnumerable, SC.MutableArray,
  /** @scope SC.RecordArray.prototype */ {

  /**
    The store that owns this record array.  All record arrays must have a
    store to function properly.

    NOTE: You **MUST** set this property on the `RecordArray` when creating
    it or else it will fail.

    @type SC.Store
  */
  store: null,

  /**
    The `Query` object this record array is based upon.  All record arrays
    **MUST** have an associated query in order to function correctly.  You
    cannot change this property once it has been set.

    NOTE: You **MUST** set this property on the `RecordArray` when creating
    it or else it will fail.

    @type SC.Query
  */
  query: null,

  /**
    The array of `storeKeys` as retrieved from the owner store.

    @type SC.Array
  */
  storeKeys: null,

  /**
    The current status for the record array.  Read from the underlying
    store.

    @type Number
  */
  status: SC.Record.EMPTY,

  /**
    The current editable state based on the query. If this record array is not
    backed by an SC.Query, it is assumed to be editable.

    @property
    @type Boolean
  */
  isEditable: function() {
    var query = get(this, 'query');
    return query ? get(query, 'isEditable') : YES;
  }.property('query').cacheable(),

  // ..........................................................
  // ARRAY PRIMITIVES
  //

  /** @private
    Returned length is a pass-through to the `storeKeys` array.
    @property
  */
  length: function() {
    this.flush(); // cleanup pending changes
    var storeKeys = get(this, 'storeKeys');
    return storeKeys ? get(storeKeys, 'length') : 0;
  }.property('storeKeys').cacheable(),

  /** @private
    A cache of materialized records. The first time an instance of SC.Record is
    created for a store key at a given index, it will be saved to this array.

    Whenever the `storeKeys` property is reset, this cache is also reset.

    @type Array
  */
  _scra_records: null,

  /** @private
    Looks up the store key in the `storeKeys array and materializes a
    records.

    @param {Number} idx index of the object
    @return {SC.Record} materialized record
  */
  objectAt: function(idx) {

    this.flush(); // cleanup pending if needed

    var recs      = this._scra_records,
        storeKeys = get(this, 'storeKeys'),
        store     = get(this, 'store'),
        storeKey, ret ;

    if (!storeKeys || !store) return undefined; // nothing to do
    if (recs && (ret=recs[idx])) return ret ; // cached

    // not in cache, materialize
    if (!recs) this._scra_records = recs = [] ; // create cache
    storeKey = storeKeys.objectAt(idx);

    if (storeKey) {
      // if record is not loaded already, then ask the data source to
      // retrieve it
      if (store.peekStatus(storeKey) === SC.Record.EMPTY) {
        store.retrieveRecord(null, null, storeKey);
      }
      recs[idx] = ret = store.materializeRecord(storeKey);
    }
    return ret ;
  },

  /** @private - optimized forEach loop. */
  forEach: function(callback, target) {
    this.flush();

    var recs      = this._scra_records,
        storeKeys = get(this, 'storeKeys'),
        store     = get(this, 'store'),
        len       = storeKeys ? get(storeKeys, 'length') : 0,
        idx, storeKey, rec;

    if (!storeKeys || !store) return this; // nothing to do
    if (!recs) recs = this._scra_records = [] ;
    if (!target) target = this;

    for(idx=0;idx<len;idx++) {
      rec = recs[idx];
      if (!rec) {
        rec = recs[idx] = store.materializeRecord(storeKeys.objectAt(idx));
      }
      callback.call(target, rec, idx, this);
    }

    return this;
  },

  /** @private
    Replaces a range of records starting at a given index with the replacement
    records provided. The objects to be inserted must be instances of SC.Record
    and must have a store key assigned to them.

    Note that most SC.RecordArrays are *not* editable via `replace()`, since they
    are generated by a rule-based SC.Query. You can check the `isEditable` property
    before attempting to modify a record array.

    @param {Number} idx start index
    @param {Number} amt count of records to remove
    @param {SC.RecordArray} recs the records that should replace the removed records

    @returns {SC.RecordArray} receiver, after mutation has occurred
  */
  replace: function(idx, amt, recs) {

    this.flush(); // cleanup pending if needed

    var storeKeys = get(this, 'storeKeys'),
        len       = recs ? get(recs, 'length') : 0,
        i, keys;

    if (!storeKeys) throw "Unable to edit an SC.RecordArray that does not have its storeKeys property set.";

    if (!get(this, 'isEditable')) throw SC.RecordArray.NOT_EDITABLE;

    // map to store keys
    keys = [] ;
    for(i=0;i<len;i++) keys[i] = get(recs.objectAt(i), 'storeKey');

    // pass along - if allowed, this should trigger the content observer
    storeKeys.replace(idx, amt, keys);
    return this;
  },

  /**
    Returns YES if the passed can be found in the record array.  This is
    provided for compatibility with SC.Set.

    @param {SC.Record} record
    @returns {Boolean}
  */
  contains: function(record) {
    return this.indexOf(record)>=0;
  },

  /** @private
    Returns the first index where the specified record is found.

    @param {SC.Record} record
    @param {Number} startAt optional starting index
    @returns {Number} index
  */
  indexOf: function(record, startAt) {
    if (!(record instanceof  SC.Record)) {
      SC.Logger.warn("Using indexOf on %@ with an object that is not an SC.Record".fmt(record));
      return -1; // only takes records
    }

    this.flush();

    var storeKey  = get(record, 'storeKey'),
        storeKeys = get(this, 'storeKeys');

    return storeKeys ? storeKeys.indexOf(storeKey, startAt) : -1;
  },

  /** @private
    Returns the last index where the specified record is found.

    @param {SC.Record} record
    @param {Number} startAt optional starting index
    @returns {Number} index
  */
  lastIndexOf: function(record, startAt) {
    if (!(record instanceof  SC.Record)) {
      SC.Logger.warn("Using lastIndexOf on %@ with an object that is not an SC.Record".fmt(record));
      return -1; // only takes records
    }

    this.flush();

    var storeKey  = get(record, 'storeKey'),
        storeKeys = get(this, 'storeKeys');
    return storeKeys ? storeKeys.lastIndexOf(storeKey, startAt) : -1;
  },

  /**
    Adds the specified record to the record array if it is not already part
    of the array.  Provided for compatibilty with `SC.Set`.

    @param {SC.Record} record
    @returns {SC.RecordArray} receiver
  */
  add: function(record) {
    if (!(record instanceof  SC.Record)) return this ;
    if (this.indexOf(record)<0) this.pushObject(record);
    return this ;
  },

  /**
    Removes the specified record from the array if it is not already a part
    of the array.  Provided for compatibility with `SC.Set`.

    @param {SC.Record} record
    @returns {SC.RecordArray} receiver
  */
  remove: function(record) {
    if (!(record instanceof  SC.Record)) return this ;
    this.removeObject(record);
    return this ;
  },

  // ..........................................................
  // HELPER METHODS
  //

  /**
    Extends the standard SC.Enumerable implementation to return results based
    on a Query if you pass it in.

    @param {SC.Query} query a SC.Query object
    @param {Object} target the target object to use

    @returns {SC.RecordArray}
  */
  find: function(query, target) {
    if (query && query.isQuery) {
      return get(this, 'store').find(query.queryWithScope(this));
    } else return this._super(query, target);
  },

  /**
    Call whenever you want to refresh the results of this query.  This will
    notify the data source, asking it to refresh the contents.

    @returns {SC.RecordArray} receiver
  */
  refresh: function() {
    get(this, 'store').refreshQuery(get(this, 'query'));
    return this;
  },

  /**
    Will recompute the results based on the `SC.Query` attached to the record
    array. Useful if your query is based on computed properties that might
    have changed. Use `refresh()` instead of you want to trigger a fetch on
    your data source since this will purely look at records already loaded
    into the store.

    @returns {SC.RecordArray} receiver
  */
  reload: function() {
    this.flush(YES);
    return this;
  },

  /**
    Destroys the record array.  Releases any `storeKeys`, and deregisters with
    the owner store.

    @returns {SC.RecordArray} receiver
  */
  destroy: function() {
    if (!get(this, 'isDestroyed')) {
      get(this, 'store').recordArrayWillDestroy(this);
    }

    this._super();
  },

  // ..........................................................
  // STORE CALLBACKS
  //

  // **NOTE**: `storeWillFetchQuery()`, `storeDidFetchQuery()`,
  // `storeDidCancelQuery()`, and `storeDidErrorQuery()` are tested implicitly
  // through the related methods in `SC.Store`.  We're doing it this way
  // because eventually this particular implementation is likely to change;
  // moving some or all of this code directly into the store. -CAJ

  /** @private
    Called whenever the store initiates a refresh of the query.  Sets the
    status of the record array to the appropriate status.

    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeWillFetchQuery: function(query) {
    var status = get(this, 'status'),
        K      = SC.Record;
    if ((status === K.EMPTY) || (status === K.ERROR)) status = K.BUSY_LOADING;
    if (status & K.READY) status = K.BUSY_REFRESH;
    set(this, 'status', status);
    return this ;
  },

  /** @private
    Called whenever the store has finished fetching a query.

    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeDidFetchQuery: function(query) {
    set(this, 'status', SC.Record.READY_CLEAN);
    return this ;
  },

  /** @private
    Called whenever the store has cancelled a refresh.  Sets the
    status of the record array to the appropriate status.

    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeDidCancelQuery: function(query) {
    var status = get(this, 'status'),
        K      = SC.Record;
    if (status === K.BUSY_LOADING) status = K.EMPTY;
    else if (status === K.BUSY_REFRESH) status = K.READY_CLEAN;
    set(this, 'status', status);
    return this ;
  },

  /** @private
    Called whenever the store encounters an error while fetching.  Sets the
    status of the record array to the appropriate status.

    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeDidErrorQuery: function(query) {
    set(this, 'status', SC.Record.ERROR);
    return this ;
  },

  /** @private
    Called by the store whenever it changes the state of certain store keys. If
    the receiver cares about these changes, it will mark itself as dirty and add
    the changed store keys to the _scq_changedStoreKeys index set.

    The next time you try to access the record array, it will call `flush()` and
    add the changed keys to the underlying `storeKeys` array if the new records
    match the conditions of the record array's query.

    @param {SC.Array} storeKeys the effected store keys
    @param {SC.Set} recordTypes the record types for the storeKeys.
    @returns {SC.RecordArray} receiver
  */
  storeDidChangeStoreKeys: function(storeKeys, recordTypes) {
    var query =  get(this, 'query');
    // fast path exits
    if (get(query, 'location') !== SC.Query.LOCAL) return this;
    if (!query.containsRecordTypes(recordTypes)) return this;

    // ok - we're interested.  mark as dirty and save storeKeys.
    var changed = this._scq_changedStoreKeys;
    if (!changed) changed = this._scq_changedStoreKeys = SC.IndexSet.create();
    changed.addEach(storeKeys);

    set(this, 'needsFlush', YES);
    if (get(this, 'storeKeys')) {
      this.flush();
    }

    return this;
  },

  /**
    Applies the query to any pending changed store keys, updating the record
    array contents as necessary.  This method is called automatically anytime
    you access the RecordArray to make sure it is up to date, but you can
    call it yourself as well if you need to force the record array to fully
    update immediately.

    Currently this method only has an effect if the query location is
    `SC.Query.LOCAL`.  You can call this method on any `RecordArray` however,
    without an error.

    @param {Boolean} _flush to force it - use reload() to trigger it
    @returns {SC.RecordArray} receiver
  */
  flush: function(_flush) {

    // Are we already inside a flush?  If so, then don't do it again, to avoid
    // never-ending recursive flush calls.  Instead, we'll simply mark
    // ourselves as needing a flush again when we're done.
    if (this._insideFlush) {
      set(this, 'needsFlush', YES);
      return this;
    }

    if (!get(this, 'needsFlush') && !_flush) return this; // nothing to do
    set(this, 'needsFlush', NO); // avoid running again.

    // fast exit
    var query = get(this, 'query'),
        store = get(this, 'store');
    if (!store || !query || get(query, 'location') !== SC.Query.LOCAL) {
      return this;
    }

    this._insideFlush = YES;

    // OK, actually generate some results
    var storeKeys = get(this, 'storeKeys'),
        changed   = this._scq_changedStoreKeys,
        didChange = NO,
        K         = SC.Record,
        storeKeysToPace = [],
        startDate = new Date(),
        rec, status, recordType, sourceKeys, scope, included;

    // if we have storeKeys already, just look at the changed keys
    var oldStoreKeys = storeKeys;
    if (storeKeys && !_flush) {

      if (changed) {
        changed.forEach(function(storeKey) {
          if(storeKeysToPace.length>0 || new Date()-startDate>SC.RecordArray.QUERY_MATCHING_THRESHOLD) {
            storeKeysToPace.push(storeKey);
            return;
          }
          // get record - do not include EMPTY or DESTROYED records
          status = store.peekStatus(storeKey);
          if (!(status & K.EMPTY) && !((status & K.DESTROYED) || (status === K.BUSY_DESTROYING))) {
            rec = store.materializeRecord(storeKey);
            included = !!(rec && query.contains(rec));
          } else included = NO ;

          // if storeKey should be in set but isn't -- add it.
          if (included) {
            if (storeKeys.indexOf(storeKey)<0) {
              if (!didChange) storeKeys = storeKeys.copy();
              storeKeys.pushObject(storeKey);
            }
          // if storeKey should NOT be in set but IS -- remove it
          } else {
            if (storeKeys.indexOf(storeKey)>=0) {
              if (!didChange) storeKeys = storeKeys.copy();
              storeKeys.removeObject(storeKey);
            } // if (storeKeys.indexOf)
          } // if (included)

        }, this);
        // make sure resort happens
        didChange = YES ;

      } // if (changed)

      //console.log(this.toString() + ' partial flush took ' + (new Date()-startDate) + ' ms');

    // if no storeKeys, then we have to go through all of the storeKeys
    // and decide if they belong or not.  ick.
    } else {

      // collect the base set of keys.  if query has a parent scope, use that
      if (scope = get(query, 'scope')) {
        sourceKeys = get(scope.flush(), 'storeKeys');
      // otherwise, lookup all storeKeys for the named recordType...
      } else if (recordType = get(query, 'expandedRecordTypes')) {
        sourceKeys = SC.IndexSet.create();
        recordType.forEach(function(cur) {
          sourceKeys.addEach(store.storeKeysFor(recordType));
        });
      }

      // loop through storeKeys to determine if it belongs in this query or
      // not.
      storeKeys = [];
      sourceKeys.forEach(function(storeKey) {
        if(storeKeysToPace.length>0 || new Date()-startDate>SC.RecordArray.QUERY_MATCHING_THRESHOLD) {
          storeKeysToPace.push(storeKey);
          return;
        }

        status = store.peekStatus(storeKey);
        if (!(status & K.EMPTY) && !((status & K.DESTROYED) || (status === K.BUSY_DESTROYING))) {
          rec = store.materializeRecord(storeKey);
          if (rec && query.contains(rec)) storeKeys.push(storeKey);
        }
      });

      //console.log(this.toString() + ' full flush took ' + (new Date()-startDate) + ' ms');

      didChange = YES ;
    }

    // if we reach our threshold of pacing we need to schedule the rest of the
    // storeKeys to also be updated
    if(storeKeysToPace.length>0) {
      var self = this;
      // use setTimeout here to guarantee that we hit the next runloop,
      // and not the same runloop which the invoke* methods do not guarantee
      window.setTimeout(function() {
        SC.run(function() {
          if(!self || get(self, 'isDestroyed')) return;
          set(self, 'needsFlush', YES);
          self._scq_changedStoreKeys = SC.IndexSet.create().addEach(storeKeysToPace);
          self.flush();
        });
      }, 1);
    }

    // clear set of changed store keys
    if (changed) changed.clear();

    // only resort and update if we did change
    if (didChange) {

      // storeKeys must be a new instance because orderStoreKeys() works on it
      if (storeKeys && (storeKeys===oldStoreKeys)) {
        storeKeys = storeKeys.copy();
      }

      storeKeys = SC.Query.orderStoreKeys(storeKeys, query, store);
      if (SC.compare(oldStoreKeys, storeKeys) !== 0){
        set(this, 'storeKeys', SC.copy(storeKeys)); // replace content
      }
    }

    this._insideFlush = NO;
    return this;
  },

  /**
    Set to `YES` when the query is dirty and needs to update its storeKeys
    before returning any results.  `RecordArray`s always start dirty and become
    clean the first time you try to access their contents.

    @type Boolean
  */
  needsFlush: YES,

  // ..........................................................
  // EMULATE SC.StoreError API
  //

  /**
    Returns `YES` whenever the status is `SC.Record.ERROR`.  This will allow
    you to put the UI into an error state.

    @property
    @type Boolean
  */
  isError: function() {
    return get(this, 'status') & SC.Record.ERROR;
  }.property('status').cacheable(),

  /**
    Returns the receiver if the record array is in an error state.  Returns
    `null` otherwise.

    @property
    @type SC.Record
  */
  errorValue: function() {
    return get(this, 'isError') ? SC.val(get(this, 'errorObject')) : null ;
  }.property('isError').cacheable(),

  /**
    Returns the current error object only if the record array is in an error
    state. If no explicit error object has been set, returns
    `SC.Record.GENERIC_ERROR.`

    @property
    @type SC.StoreError
  */
  errorObject: function() {
    if (get(this, 'isError')) {
      var store = get(this, 'store');
      return store.readQueryError(get(this, 'query')) || SC.Record.GENERIC_ERROR;
    } else return null ;
  }.property('isError').cacheable(),

  // ..........................................................
  // INTERNAL SUPPORT
  //

  propertyWillChange: function(key) {
    if (key === 'storeKeys') {
      var storeKeys = get(this, 'storeKeys');
      var len = storeKeys ? get(storeKeys, 'length') : 0;

      this.arrayContentWillChange(0, len, 0);
    }

    return this._super(key);
  },

  /** @private
    Invoked whenever the `storeKeys` array changes.  Observes changes.
  */
  _storeKeysDidChange: function() {
    var storeKeys = get(this, 'storeKeys');

    var prev = this._prevStoreKeys, oldLen, newLen,
        f    = this._storeKeysContentDidChange,
        fs   = this._storeKeysStateDidChange;

    if (storeKeys === prev) { return; } // nothing to do
    oldLen = prev ? get(prev, 'length') : 0;
    newLen = storeKeys ? get(storeKeys, 'length') : 0;

    this._storeKeysContentWillChange(prev, 0, oldLen, newLen);

    if (prev) {
      prev.removeArrayObserver(this, {
        willChange: this._storeKeysContentWillChange,
        didChange: this._storeKeysContentDidChange
      });
    }

    this._prevStoreKeys = storeKeys;
    if (storeKeys) {
      storeKeys.addArrayObserver(this, {
        willChange: this._storeKeysContentWillChange,
        didChange: this._storeKeysContentDidChange
      });
    }

    this._storeKeysContentDidChange(storeKeys, 0, oldLen, newLen);

  }.observes('storeKeys'),

  /** @private
    If anyone adds an array observer on to the record array, make sure
    we flush so that the observers don't fire the first time length is
    calculated.
  */
  addArrayObserver: function() {
    this.flush();
    return this._super.apply(this, arguments);
  },

  _storeKeysContentWillChange: function(target, start, removedCount, addedCount) {
    this.arrayContentWillChange(start, removedCount, addedCount);
  },

  /** @private
    Invoked whenever the content of the `storeKeys` array changes.  This will
    dump any cached record lookup and then notify that the enumerable content
    has changed.
  */
  _storeKeysContentDidChange: function(target, start, removedCount, addedCount) {
    if (this._scra_records) this._scra_records.length=0 ; // clear cache

    this.arrayContentDidChange(start, removedCount, addedCount);
  },

  /** @private */
  init: function() {
    this._super();
    this._storeKeysDidChange();
  }

});

SC.RecordArray.reopenClass(/** @scope SC.RecordArray.prototype */{

  /**
    Standard error throw when you try to modify a record that is not editable

    @type SC.StoreError
  */
  NOT_EDITABLE: SC.StoreError.desc("SC.RecordArray is not editable"),

  /**
    Number of milliseconds to allow a query matching to run for. If this number
    is exceeded, the query matching will be paced so as to not lock up the
    browser (by essentially splitting the work with a setTimeout)

    @type Number
  */
  QUERY_MATCHING_THRESHOLD: 100
});


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */




var get = SC.get, set = SC.set, getPath = SC.getPath, none = SC.none;

/**
  @class


  The Store is where you can find all of your dataHashes. Stores can be
  chained for editing purposes and committed back one chain level at a time
  all the way back to a persistent data source.

  Every application you create should generally have its own store objects.
  Once you create the store, you will rarely need to work with the store
  directly except to retrieve records and collections.

  Internally, the store will keep track of changes to your json data hashes
  and manage syncing those changes with your data source.  A data source may
  be a server, local storage, or any other persistent code.

  @extends SC.Object
  @since SproutCore 1.0
*/
SC.Store = SC.Object.extend( /** @scope SC.Store.prototype */ {

  /**
    An (optional) name of the store, which can be useful during debugging,
    especially if you have multiple nested stores.

    @type String
  */
  name: null,

  /**
    An array of all the chained stores that current rely on the receiver
    store.

    @type Array
  */
  nestedStores: null,

  /**
    The data source is the persistent storage that will provide data to the
    store and save changes.  You normally will set your data source when you
    first create your store in your application.

    @type SC.DataSource
  */
  dataSource: null,

  /**
    This type of store is not nested.

    @default NO
    @type Boolean
  */
  isNested: NO,

  /**
    This type of store is not nested.

    @default NO
    @type Boolean
  */
  commitRecordsAutomatically: NO,

  // ..........................................................
  // DATA SOURCE SUPPORT
  //

  /**
    Convenience method.  Sets the current data source to the passed property.
    This will also set the store property on the dataSource to the receiver.

    If you are using this from the `core.js` method of your app, you may need to
    just pass a string naming your data source class.  If this is the case,
    then your data source will be instantiated the first time it is requested.

    @param {SC.DataSource|String} dataSource the data source
    @returns {SC.Store} receiver
  */
  from: function(dataSource) {
    set(this, 'dataSource', dataSource);
    return this ;
  },

  // lazily convert data source to real object
  _getDataSource: function() {
    var ret = get(this, 'dataSource');
    if (typeof ret === 'string') {
      ret = getPath( ret);
      if (ret && ret.isClass) ret = ret.create();
      if (ret) set(this, 'dataSource', ret);
    }
    return ret;
  },

  /**
    Convenience method.  Creates a `CascadeDataSource` with the passed
    data source arguments and sets the `CascadeDataSource` as the data source
    for the receiver.

    @param {SC.DataSource...} dataSource one or more data source arguments
    @returns {SC.Store} reciever
  */
  cascade: function(dataSource) {
    var dataSources = Array.prototype.slice.call(arguments) ;
    dataSource = SC.CascadeDataSource.create({
      dataSources: dataSources
    });
    return this.from(dataSource);
  },

  // ..........................................................
  // STORE CHAINING
  //

  /**
    Returns a new nested store instance that can be used to buffer changes
    until you are ready to commit them.  When you are ready to commit your
    changes, call `commitChanges()` or `destroyChanges()` and then `destroy()`
    when you are finished with the chained store altogether.

        store = MyApp.store.chain();
        .. edit edit edit
        store.commitChanges().destroy();

    @param {Hash} attrs optional attributes to set on new store
    @param {Class} newStoreClass optional the class of the newly-created nested store (defaults to SC.NestedStore)
    @returns {SC.NestedStore} new nested store chained to receiver
  */
  chain: function(attrs, newStoreClass) {
    if (!attrs) attrs = {};

    attrs.parentStore = this;
    if (!newStoreClass) newStoreClass = SC.NestedStore;

    // Ensure the passed-in class is a type of nested store.
    sc_assert("%@ is a valid class".fmt(newStoreClass),
      SC.typeOf(newStoreClass) === 'class');
    sc_assert("%@ is a type of SC.NestedStore".fmt(newStoreClass),
      SC.NestedStore.detect(newStoreClass));

    // Replicate parent records references
    attrs.childRecords = this.childRecords ? SC.copy(this.childRecords) : {};
    attrs.parentRecords = this.parentRecords ? SC.copy(this.parentRecords) : {};

    var ret    = newStoreClass.create(attrs),
        nested = this.nestedStores;

    if (!nested) nested = this.nestedStores = [];
    nested.push(ret);
    return ret ;
  },

  /** @private

    Called by a nested store just before it is destroyed so that the parent
    can remove the store from its list of nested stores.

    @returns {SC.Store} receiver
  */
  willDestroyNestedStore: function(nestedStore) {
    if (this.nestedStores) {
      this.nestedStores.removeObject(nestedStore);
    }
    return this ;
  },

  /**
    Used to determine if a nested store belongs directly or indirectly to the
    receiver.

    @param {SC.Store} store store instance
    @returns {Boolean} YES if belongs
  */
  hasNestedStore: function(store) {
    while(store && (store !== this)) store = get(store, 'parentStore');
    return store === this ;
  },

  // ..........................................................
  // SHARED DATA STRUCTURES
  //

  /** @private
    JSON data hashes indexed by store key.

    *IMPORTANT: Property is not observable*

    Shared by a store and its child stores until you make edits to it.

    @type Hash
  */
  dataHashes: null,

  /** @private
    The current status of a data hash indexed by store key.

    *IMPORTANT: Property is not observable*

    Shared by a store and its child stores until you make edits to it.

    @type Hash
  */
  statuses: null,

  /** @private
    This array contains the revisions for the attributes indexed by the
    storeKey.

    *IMPORTANT: Property is not observable*

    Revisions are used to keep track of when an attribute hash has been
    changed. A store shares the revisions data with its parent until it
    starts to make changes to it.

    @type Hash
  */
  revisions: null,

  /**
    Array indicates whether a data hash is possibly in use by an external
    record for editing.  If a data hash is editable then it may be modified
    at any time and therefore chained stores may need to clone the
    attributes before keeping a copy of them.

    Note that this is kept as an array because it will be stored as a dense
    array on some browsers, making it faster.

    @type Array
  */
  editables: null,

  /**
    A set of storeKeys that need to be committed back to the data source. If
    you call `commitRecords()` without passing any other parameters, the keys
    in this set will be committed instead.

    @type SC.Set
  */
  changelog: null,

  /**
    An array of `SC.StoreError` objects associated with individual records in the
    store (indexed by store keys).

    Errors passed form the data source in the call to dataSourceDidError() are
    stored here.

    @type Array
  */
  recordErrors: null,

  /**
    A hash of `SC.StoreError` objects associated with queries (indexed by the GUID
    of the query).

    Errors passed from the data source in the call to
    `dataSourceDidErrorQuery()` are stored here.

    @type Hash
  */
  queryErrors: null,

  /**
    A hash of child Records and there immediate parents
  */
  childRecords: null,

  /**
    A hash of parent records with registered children
  */
  parentRecords: null,

  // ..........................................................
  // CORE ATTRIBUTE API
  //
  // The methods in this layer work on data hashes in the store.  They do not
  // perform any changes that can impact records.  Usually you will not need
  // to use these methods.

  /**
    Returns the current edit status of a storekey.  May be one of
    `EDITABLE` or `LOCKED`.  Used mostly for unit testing.

    @param {Number} storeKey the store key
    @returns {Number} edit status
  */
  storeKeyEditState: function(storeKey) {
    var editables = this.editables, locks = this.locks;
    return (editables && editables[storeKey]) ? SC.Store.EDITABLE : SC.Store.LOCKED ;
  },

  /**
    Returns the data hash for the given `storeKey`.  This will also 'lock'
    the hash so that further edits to the parent store will no
    longer be reflected in this store until you reset.

    @param {Number} storeKey key to retrieve
    @returns {Hash} data hash or null
  */
  readDataHash: function(storeKey) {
    return this.dataHashes[storeKey];
  },

  /**
    Returns the data hash for the `storeKey`, cloned so that you can edit
    the contents of the attributes if you like.  This will do the extra work
    to make sure that you only clone the attributes one time.

    If you use this method to modify data hash, be sure to call
    `dataHashDidChange()` when you make edits to record the change.

    @param {Number} storeKey the store key to retrieve
    @returns {Hash} the attributes hash
  */
  readEditableDataHash: function(storeKey) {
    // read the value - if there is no hash just return; nothing to do
    var ret = this.dataHashes[storeKey];
    if (!ret) return ret ; // nothing to do.

    // clone data hash if not editable
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    if (!editables[storeKey]) {
      editables[storeKey] = 1 ; // use number to store as dense array
      ret = this.dataHashes[storeKey] = SC.copy(ret, YES);
    }
    return ret;
  },

  /**
    Reads a property from the hash - cloning it if needed so you can modify
    it independently of any parent store.  This method is really only well
    tested for use with toMany relationships.  Although it is public you
    generally should not call it directly.

    @param {Number} storeKey storeKey of data hash
    @param {String} propertyName property to read
    @returns {Object} editable property value
  */
  readEditableProperty: function(storeKey, propertyName) {
    var hash      = this.readEditableDataHash(storeKey),
        editables = this.editables[storeKey], // get editable info...
        ret       = hash[propertyName];

    // editables must be made into a hash so that we can keep track of which
    // properties have already been made editable
    if (editables === 1) editables = this.editables[storeKey] = {};

    // clone if needed
    if (!editables[propertyName]) {
      ret = hash[propertyName];
      if (ret && ret.isCopyable) ret = hash[propertyName] = ret.copy(YES);
      editables[propertyName] = YES ;
    }

    return ret ;
  },

  /**
    Replaces the data hash for the `storeKey`.  This will lock the data hash
    and mark them as cloned.  This will also call `dataHashDidChange()` for
    you.

    Note that the hash you set here must be a different object from the
    original data hash.  Once you make a change here, you must also call
    `dataHashDidChange()` to register the changes.

    If the data hash does not yet exist in the store, this method will add it.
    Pass the optional status to edit the status as well.

    @param {Number} storeKey the store key to write
    @param {Hash} hash the new hash
    @param {String} status the new hash status
    @returns {SC.Store} receiver
  */
  writeDataHash: function(storeKey, hash, status) {

    // update dataHashes and optionally status.
    if (hash) this.dataHashes[storeKey] = hash;
    if (status) this.statuses[storeKey] = status ;

    // also note that this hash is now editable
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    editables[storeKey] = 1 ; // use number for dense array support

    var that = this;
    this._propagateToChildren(storeKey, function(storeKey){
      that.writeDataHash(storeKey, null, status);
    });

    return this ;
  },

  /**
    Removes the data hash from the store.  This does not imply a deletion of
    the record.  You could be simply unloading the record.  Either way,
    removing the dataHash will be synced back to the parent store but not to
    the server.

    Note that you can optionally pass a new status to go along with this. If
    you do not pass a status, it will change the status to `SC.RECORD_EMPTY`
    (assuming you just unloaded the record).  If you are deleting the record
    you may set it to `SC.Record.DESTROYED_CLEAN`.

    Be sure to also call `dataHashDidChange()` to register this change.

    @param {Number} storeKey
    @param {String} status optional new status
    @returns {SC.Store} reciever
  */
  removeDataHash: function(storeKey, status) {
     // don't use delete -- that will allow parent dataHash to come through
    this.dataHashes[storeKey] = null;
    this.statuses[storeKey] = status || SC.Record.EMPTY;

    // hash is gone and therefore no longer editable
    var editables = this.editables;
    if (editables) editables[storeKey] = 0 ;

    return this ;
  },

  /**
    Reads the current status for a storeKey.  This will also lock the data
    hash.  If no status is found, returns `SC.RECORD_EMPTY`.

    @param {Number} storeKey the store key
    @returns {Number} status
  */
  readStatus: function(storeKey) {
    // use readDataHash to handle optimistic locking.  this could be inlined
    // but for now this minimized copy-and-paste code.
    this.readDataHash(storeKey);
    return this.statuses[storeKey] || SC.Record.EMPTY;
  },

  /**
    Reads the current status for the storeKey without actually locking the
    record.  Usually you won't need to use this method.  It is mostly used
    internally.

    @param {Number} storeKey the store key
    @returns {Number} status
  */
  peekStatus: function(storeKey) {
    return this.statuses[storeKey] || SC.Record.EMPTY;
  },

  /**
    Writes the current status for a storeKey.  If the new status is
    `SC.Record.ERROR`, you may also pass an optional error object.  Otherwise
    this param is ignored.

    @param {Number} storeKey the store key
    @param {String} newStatus the new status
    @param {SC.StoreError} error optional error object
    @returns {SC.Store} receiver
  */
  writeStatus: function(storeKey, newStatus) {
    // use writeDataHash for now to handle optimistic lock.  maximize code
    // reuse.
    return this.writeDataHash(storeKey, null, newStatus);
  },

  /**
    Call this method whenever you modify some editable data hash to register
    with the Store that the attribute values have actually changed.  This will
    do the book-keeping necessary to track the change across stores including
    managing locks.

    @param {Number|Array} storeKeys one or more store keys that changed
    @param {Number} rev optional new revision number. normally leave null
    @param {Boolean} statusOnly (optional) YES if only status changed
    @param {String} key that changed (optional)
    @returns {SC.Store} receiver
  */
  dataHashDidChange: function(storeKeys, rev, statusOnly, key) {

    // update the revision for storeKey.  Use generateStoreKey() because that
    // gaurantees a universally (to this store hierarchy anyway) unique
    // key value.
    if (!rev) rev = SC.Store.generateStoreKey();
    var isArray, len, idx, storeKey;

    isArray = SC.typeOf(storeKeys) === 'array';
    if (isArray) {
      len = storeKeys.length;
    } else {
      len = 1;
      storeKey = storeKeys;
    }

    var that = this;

    function iter(storeKey){
      that.dataHashDidChange(storeKey, null, statusOnly, key);
    }

    for(idx=0;idx<len;idx++) {
      if (isArray) storeKey = storeKeys[idx];
      this.revisions[storeKey] = rev;
      this._notifyRecordPropertyChange(storeKey, statusOnly, key);

      this._propagateToChildren(storeKey, iter);
    }

    return this ;
  },

  /** @private
    Will push all changes to a the recordPropertyChanges property
    and execute `flush()` once at the end of the runloop.
  */
  _notifyRecordPropertyChange: function(storeKey, statusOnly, key) {
    var records      = this.records,
        nestedStores = get(this, 'nestedStores'),
        K            = SC.Store,
        rec, editState, len, idx, store, status, keys;

    // pass along to nested stores
    len = nestedStores ? nestedStores.length : 0 ;
    for(idx=0;idx<len;idx++) {
      store = nestedStores[idx];
      status = store.peekStatus(storeKey); // important: peek avoids read-lock
      editState = store.storeKeyEditState(storeKey);

      // when store needs to propagate out changes in the parent store
      // to nested stores
      if (editState === K.INHERITED) {
        store._notifyRecordPropertyChange(storeKey, statusOnly, key);

      } else if (status & SC.Record.BUSY) {
        // make sure nested store does not have any changes before resetting
        if(get(store, 'hasChanges')) throw K.CHAIN_CONFLICT_ERROR;
        store.reset();
      }
    }

    // store info in changes hash and schedule notification if needed.
    var changes = this.recordPropertyChanges;
    if (!changes) {
      changes = this.recordPropertyChanges =
        { storeKeys:      SC.Set.create(),
          records:        SC.Set.create(),
          hasDataChanges: SC.Set.create(),
          propertyForStoreKeys: {} };
    }

    changes.storeKeys.add(storeKey);

    if (records && (rec=records[storeKey])) {
      changes.records.push(storeKey);

      // If there are changes other than just the status we need to record
      // that information so we do the right thing during the next flush.
      // Note that if we're called multiple times before flush and one call
      // has `statusOnly=true` and another has `statusOnly=false`, the flush
      // will (correctly) operate in `statusOnly=false` mode.
      if (!statusOnly) changes.hasDataChanges.push(storeKey);

      // If this is a key specific change, make sure that only those
      // properties/keys are notified.  However, if a previous invocation of
      // `_notifyRecordPropertyChange` specified that all keys have changed, we
      // need to respect that.
      if (key) {
        if (!(keys = changes.propertyForStoreKeys[storeKey])) {
          keys = changes.propertyForStoreKeys[storeKey] = SC.Set.create();
        }

        // If it's '*' instead of a set, then that means there was a previous
        // invocation that said all keys have changed.
        if (keys !== '*') {
          keys.add(key);
        }
      }
      else {
        // Mark that all properties have changed.
        changes.propertyForStoreKeys[storeKey] = '*';
      }
    }

    SC.run.once(this, this.flush);
    return this;
  },

  /**
    Delivers any pending changes to materialized records.  Normally this
    happens once, automatically, at the end of the RunLoop.  If you have
    updated some records and need to update records immediately, however,
    you may call this manually.

    @returns {SC.Store} receiver
  */
  flush: function() {
    if (!this.recordPropertyChanges) return this;

    var changes              = this.recordPropertyChanges,
        storeKeys            = changes.storeKeys,
        hasDataChanges       = changes.hasDataChanges,
        records              = changes.records,
        propertyForStoreKeys = changes.propertyForStoreKeys,
        recordTypes = SC.Set.create(),
        rec, recordType, statusOnly, idx, len, storeKey, keys;

    storeKeys.forEach(function(storeKey) {
      if (records.contains(storeKey)) {
        statusOnly = hasDataChanges.contains(storeKey) ? NO : YES;
        rec = this.records[storeKey];
        keys = propertyForStoreKeys ? propertyForStoreKeys[storeKey] : null;

        // Are we invalidating all keys?  If so, don't pass any to
        // storeDidChangeProperties.
        if (keys === '*') keys = null;

        // remove it so we don't trigger this twice
        records.remove(storeKey);

        if (rec) rec.storeDidChangeProperties(statusOnly, keys);
      }

      recordType = SC.Store.recordTypeFor(storeKey);
      recordTypes.add(recordType);

    }, this);

    if (get(storeKeys, 'length') > 0) this._notifyRecordArrays(storeKeys, recordTypes);

    storeKeys.clear();
    hasDataChanges.clear();
    records.clear();
    // Provide full reference to overwrite
    this.recordPropertyChanges.propertyForStoreKeys = {};

    return this;
  },

  /**
    Resets the store content.  This will clear all internal data for all
    records, resetting them to an EMPTY state.  You generally do not want
    to call this method yourself, though you may override it.

    @returns {SC.Store} receiver
  */
  reset: function() {

    // create a new empty data store
    this.dataHashes = {} ;
    this.revisions  = {} ;
    this.statuses   = {} ;

    // also reset temporary objects and errors
    this.chainedChanges = this.locks = this.editables = null;
    this.changelog = null ;
    this.recordErrors = null;
    this.queryErrors = null;

    var records = this.records, storeKey;
    if (records) {
      for(storeKey in records) {
        if (!records.hasOwnProperty(storeKey)) continue ;
        this._notifyRecordPropertyChange(parseInt(storeKey, 10), NO);
      }
    }

    set(this, 'hasChanges', NO);
  },

  /** @private
    Called by a nested store on a parent store to commit any changes from the
    store.  This will copy any changed dataHashes as well as any persistant
    change logs.

    If the parentStore detects a conflict with the optimistic locking, it will
    raise an exception before it makes any changes.  If you pass the
    force flag then this detection phase will be skipped and the changes will
    be applied even if another resource has modified the store in the mean
    time.

    @param {SC.Store} nestedStore the child store
    @param {SC.Set} changes the set of changed store keys
    @param {Boolean} force
    @returns {SC.Store} receiver
  */
  commitChangesFromNestedStore: function(nestedStore, changes, force) {
    // first, check for optimistic locking problems
    if (!force) this._verifyLockRevisions(changes, nestedStore.locks);

    // OK, no locking issues.  So let's just copy them changes.
    // get local reference to values.
    var len = changes.length, i, storeKey, myDataHashes, myStatuses,
      myEditables, myRevisions, myParentRecords, myChildRecords,
      chDataHashes, chStatuses, chRevisions, chParentRecords, chChildRecords;

    myRevisions     = this.revisions ;
    myDataHashes    = this.dataHashes;
    myStatuses      = this.statuses;
    myEditables     = this.editables ;
    myParentRecords = this.parentRecords ? this.parentRecords : this.parentRecords ={} ;
    myChildRecords  = this.childRecords ? this.childRecords : this.childRecords = {} ;

    // setup some arrays if needed
    if (!myEditables) myEditables = this.editables = [] ;
    chDataHashes    = nestedStore.dataHashes;
    chRevisions     = nestedStore.revisions ;
    chStatuses      = nestedStore.statuses;
    chParentRecords = nestedStore.parentRecords || {};
    chChildRecords  = nestedStore.childRecords || {};

    for(i=0;i<len;i++) {
      storeKey = changes[i];

      // now copy changes
      myDataHashes[storeKey]    = chDataHashes[storeKey];
      myStatuses[storeKey]      = chStatuses[storeKey];
      myRevisions[storeKey]     = chRevisions[storeKey];
      myParentRecords[storeKey] = chParentRecords[storeKey];
      myChildRecords[storeKey]  = chChildRecords[storeKey];

      myEditables[storeKey] = 0 ; // always make dataHash no longer editable

      this._notifyRecordPropertyChange(storeKey, NO);
    }

    // add any records to the changelog for commit handling
    var myChangelog = this.changelog, chChangelog = nestedStore.changelog;
    if (chChangelog) {
      if (!myChangelog) myChangelog = this.changelog = SC.Set.create();
      myChangelog.addEach(chChangelog);
    }
    this.changelog = myChangelog;

    // immediately flush changes to notify records - nested stores will flush
    // later on.
    if (!get(this, 'parentStore')) this.flush();

    return this ;
  },

  /** @private
    Verifies that the passed lock revisions match the current revisions
    in the receiver store.  If the lock revisions do not match, then the
    store is in a conflict and an exception will be raised.

    @param {Array}  changes set of changes we are trying to apply
    @param {SC.Set} locks the locks to verify
    @returns {SC.Store} receiver
  */
  _verifyLockRevisions: function(changes, locks) {
    var len = changes.length, revs = this.revisions, i, storeKey, lock, rev ;
    if (locks && revs) {
      for(i=0;i<len;i++) {
        storeKey = changes[i];
        lock = locks[storeKey] || 1;
        rev  = revs[storeKey] || 1;

        // if the save revision for the item does not match the current rev
        // the someone has changed the data hash in this store and we have
        // a conflict.
        if (lock < rev) throw SC.Store.CHAIN_CONFLICT_ERROR;
      }
    }
    return this ;
  },

  // ..........................................................
  // HIGH-LEVEL RECORD API
  //

  /**
    Finds a single record instance with the specified `recordType` and id or
    an  array of records matching some query conditions.

    Finding a Single Record
    ---

    If you pass a single `recordType` and id, this method will return an
    actual record instance.  If the record has not been loaded into the store
    yet, this method will ask the data source to retrieve it.  If no data
    source indicates that it can retrieve the record, then this method will
    return `null`.

    Note that if the record needs to be retrieved from the server, then the
    record instance returned from this method will not have any data yet.
    Instead it will have a status of `SC.Record.READY_LOADING`.  You can
    monitor the status property to be notified when the record data is
    available for you to use it.

    Find a Collection of Records
    ---

    If you pass only a record type or a query object, you can instead find
    all records matching a specified set of conditions.  When you call
    `find()` in this way, it will create a query if needed and pass it to the
    data source to fetch the results.

    If this is the first time you have fetched the query, then the store will
    automatically ask the data source to fetch any records related to it as
    well.  Otherwise you can refresh the query results at anytime by calling
    `refresh()` on the returned `RecordArray`.

    You can detect whether a RecordArray is fetching from the server by
    checking its status.

    Examples
    ---

    Finding a single record:

        MyApp.store.find(MyApp.Contact, "23"); // returns MyApp.Contact

    Finding all records of a particular type:

        MyApp.store.find(MyApp.Contact); // returns SC.RecordArray of contacts


    Finding all contacts with first name John:

        var query = SC.Query.local(MyApp.Contact, "firstName = %@", "John");
        MyApp.store.find(query); // returns SC.RecordArray of contacts

    Finding all contacts using a remote query:

        var query = SC.Query.remote(MyApp.Contact);
        MyApp.store.find(query); // returns SC.RecordArray filled by server

    @param {SC.Record|String} recordType the expected record type
    @param {String} id the id to load
    @returns {SC.Record} record instance or null
  */
  find: function(recordType, id) {

    // if recordType is passed as string, find object
    if ('string' === typeof recordType) {
      recordType = getPath(recordType);
    }

    // handle passing a query...
    if (id === undefined && !(recordType instanceof SC.Record)) {
      sc_assert('SC.Store#find() accepts only a record type of query',
        SC.Record.detect(recordType) || recordType instanceof SC.Query);

      if (!(recordType instanceof SC.Query)) {
        recordType = SC.Query.local(recordType);
      }

      return this._findQuery(recordType, YES, YES);

    // handle finding a single record
    } else {
      return this._findRecord(recordType, id);
    }
  },

  /** @private
    DEPRECATED used find() instead.

    This method will accept a record type or query and return a record array
    matching the results.  This method was commonly used prior to SproutCore
    1.0.  It has been deprecated in favor of a single `find()` method instead.

    For compatibility, this method will continue to work in SproutCore 1.0 but
    it will raise a warning.  It will be removed in a future version of
    SproutCore.
  */
  findAll: function(recordType, conditions, params) {
    SC.Logger.warn("SC.Store#findAll() will be removed in a future version of SproutCore.  Use SC.Store#find() instead");


    if (!recordType || !recordType.isQuery) {
      recordType = SC.Query.local(recordType, conditions, params);
    }

    return this._findQuery(recordType, YES, YES);
  },


  _findQuery: function(query, createIfNeeded, refreshIfNew) {

    // lookup the local RecordArray for this query.
    var cache = this._scst_recordArraysByQuery,
        key   = SC.guidFor(query),
        ret, ra ;
    if (!cache) cache = this._scst_recordArraysByQuery = {};
    ret = cache[key];

    // if a RecordArray was not found, then create one and also add it to the
    // list of record arrays to update.
    if (!ret && createIfNeeded) {
      cache[key] = ret = SC.RecordArray.create({ store: this, query: query });

      ra = get(this, 'recordArrays');
      if (!ra) set(this, 'recordArrays', ra = SC.Set.create());
      ra.add(ret);

      if (refreshIfNew) this.refreshQuery(query);
    }

    this.flush();
    return ret ;
  },

  _findRecord: function(recordType, id) {

    var storeKey ;

    // if a record instance is passed, simply use the storeKey.  This allows
    // you to pass a record from a chained store to get the same record in the
    // current store.
    if (recordType && (recordType instanceof SC.Record)) {
      storeKey = get(recordType, 'storeKey');

    // otherwise, lookup the storeKey for the passed id.  look in subclasses
    // as well.
    } else storeKey = id ? recordType.storeKeyFor(id) : null;

    if (storeKey && (this.readStatus(storeKey) === SC.Record.EMPTY)) {
      storeKey = this.retrieveRecord(recordType, id);
    }

    // now we have the storeKey, materialize the record and return it.
    return storeKey ? this.materializeRecord(storeKey) : null ;
  },

  // ..........................................................
  // RECORD ARRAY OPERATIONS
  //

  /**
    Called by the record array just before it is destroyed.  This will
    de-register it from receiving future notifications.

    You should never call this method yourself.  Instead call `destroy()` on
    the `RecordArray` directly.

    @param {SC.RecordArray} recordArray the record array
    @returns {SC.Store} receiver
  */
  recordArrayWillDestroy: function(recordArray) {
    var cache = this._scst_recordArraysByQuery,
        set   = get(this, 'recordArrays');

    if (cache) delete cache[SC.guidFor(get(recordArray, 'query'))];
    if (set) set.remove(recordArray);
    return this ;
  },

  /**
    Called by the record array whenever it needs the data source to refresh
    its contents.  Nested stores will actually just pass this along to the
    parent store.  The parent store will call `fetch()` on the data source.

    You should never call this method yourself.  Instead call `refresh()` on
    the `RecordArray` directly.

    @param {SC.Query} query the record array query to refresh
    @returns {SC.Store} receiver
  */
  refreshQuery: function(query) {
    if (!query) throw new Error("refreshQuery() requires a query");

    var cache    = this._scst_recordArraysByQuery,
        recArray = cache ? cache[SC.guidFor(query)] : null,
        source   = this._getDataSource();

    if (source && source.fetch) {
      if (recArray) recArray.storeWillFetchQuery(query);
      source.fetch.call(source, this, query);
    }

    return this ;
  },

  /** @private
    Will ask all record arrays that have been returned from `findAll`
    with an `SC.Query` to check their arrays with the new `storeKey`s

    @param {SC.IndexSet} storeKeys set of storeKeys that changed
    @param {SC.Set} recordTypes
    @returns {SC.Store} receiver
  */
  _notifyRecordArrays: function(storeKeys, recordTypes) {
    var recordArrays = get(this, 'recordArrays');
    if (!recordArrays) return this;

    recordArrays.forEach(function(recArray) {
      if (recArray) recArray.storeDidChangeStoreKeys(storeKeys, recordTypes);
    }, this);

    return this ;
  },


  // ..........................................................
  // LOW-LEVEL HELPERS
  //

  /**
    Array of all records currently in the store with the specified
    type.  This method only reflects the actual records loaded into memory and
    therefore is not usually needed at runtime.  However you will often use
    this method for testing.

    @param {SC.Record} recordType the record type
    @returns {SC.Array} array instance - usually SC.RecordArray
  */
  recordsFor: function(recordType) {
    var storeKeys     = [],
        storeKeysById = recordType.storeKeysById(),
        id, storeKey, ret;

    // collect all non-empty store keys
    for(id in storeKeysById) {
      storeKey = storeKeysById[id]; // get the storeKey
      if (this.readStatus(storeKey) !== SC.RECORD_EMPTY) {
        storeKeys.push(storeKey);
      }
    }

    if (storeKeys.length>0) {
      ret = SC.RecordArray.create({ store: this, storeKeys: storeKeys });
    } else ret = storeKeys; // empty array
    return ret ;
  },

  _TMP_REC_ATTRS: {},

  /**
    Given a `storeKey`, return a materialized record.  You will not usually
    call this method yourself.  Instead it will used by other methods when
    you find records by id or perform other searches.

    If a `recordType` has been mapped to the storeKey, then a record instance
    will be returned even if the data hash has not been requested yet.

    Each Store instance returns unique record instances for each storeKey.

    @param {Number} storeKey The storeKey for the dataHash.
    @returns {SC.Record} Returns a record instance.
  */
  materializeRecord: function(storeKey) {
    var records = this.records, ret, recordType, attrs;

    // look up in cached records
    if (!records) records = this.records = {}; // load cached records
    ret = records[storeKey];
    if (ret) return ret;

    // not found -- OK, create one then.
    recordType = SC.Store.recordTypeFor(storeKey);
    if (!recordType) return null; // not recordType registered, nothing to do

    attrs = this._TMP_REC_ATTRS ;
    attrs.storeKey = storeKey ;
    attrs.store    = this ;
    ret = records[storeKey] = recordType.create(attrs);

    return ret ;
  },

  // ..........................................................
  // CORE RECORDS API
  //
  // The methods in this section can be used to manipulate records without
  // actually creating record instances.

  /**
    Creates a new record instance with the passed `recordType` and `dataHash`.
    You can also optionally specify an id or else it will be pulled from the
    data hash.

    Note that the record will not yet be saved back to the server.  To save
    a record to the server, call `commitChanges()` on the store.

    @param {SC.Record} recordType the record class to use on creation
    @param {Hash} dataHash the JSON attributes to assign to the hash.
    @param {String} id (optional) id to assign to record

    @returns {SC.Record} Returns the created record
  */
  createRecord: function(recordType, dataHash, id) {
    var primaryKey, storeKey, status, K = SC.Record, changelog, defaultVal,
        ret, attr;

    // First, try to get an id.  If no id is passed, look it up in the
    // dataHash.
    if (!id && (primaryKey = get(recordType, 'proto').primaryKey)) {
      id = dataHash[primaryKey];
      // if still no id, check if there is a defaultValue function for
      // the primaryKey attribute and assign that
      attr = SC.RecordAttribute.attrFor(get(recordType, 'proto'), primaryKey);
      defaultVal = attr && get(attr, 'defaultValue');
      if(!id && SC.typeOf(defaultVal)==='function') {
        id = dataHash[primaryKey] = defaultVal();
      }
    }

    // Next get the storeKey - base on id if available
    storeKey = id ? recordType.storeKeyFor(id) : SC.Store.generateStoreKey();

    // now, check the state and do the right thing.
    status = this.readStatus(storeKey);

    // check state
    // any busy or ready state or destroyed dirty state is not allowed
    if ((status & K.BUSY)  ||
        (status & K.READY) ||
        (status === K.DESTROYED_DIRTY)) {
      throw id ? K.RECORD_EXISTS_ERROR : K.BAD_STATE_ERROR;

    // allow error or destroyed state only with id
    } else if (!id && (status===SC.DESTROYED_CLEAN || status===SC.StoreError)) {
      throw K.BAD_STATE_ERROR;
    }

    // add dataHash and setup initial status -- also save recordType
    this.writeDataHash(storeKey, (dataHash ? dataHash : {}), K.READY_NEW);

    SC.Store.replaceRecordTypeFor(storeKey, recordType);
    this.dataHashDidChange(storeKey);

    // Record is now in a committable state -- add storeKey to changelog
    changelog = this.changelog;
    if (!changelog) changelog = SC.Set.create();
    changelog.add(storeKey);
    this.changelog = changelog;

    // if commit records is enabled
    if(get(this, 'commitRecordsAutomatically')){
      SC.run.schedule('actions', this, this.commitRecords);
    }

    // Finally return materialized record, after we propagate the status to
    // any aggregrate records.
    ret = this.materializeRecord(storeKey);
    if (ret) ret.propagateToAggregates();
    return ret;
  },

  /**
    Creates an array of new records.  You must pass an array of `dataHash`es
    plus a `recordType` and, optionally, an array of ids.  This will create an
    array of record instances with the same record type.

    If you need to instead create a bunch of records with different data types
    you can instead pass an array of `recordType`s, one for each data hash.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} dataHashes array of data hashes
    @param {Array} ids (optional) ids to assign to records
    @returns {Array} array of materialized record instances.
  */
  createRecords: function(recordTypes, dataHashes, ids) {
    var ret = [], recordType, id, isArray, len = dataHashes.length, idx ;
    isArray = SC.typeOf(recordTypes) === 'array';
    if (!isArray) recordType = recordTypes;
    for(idx=0;idx<len;idx++) {
      if (isArray) recordType = recordTypes[idx] || SC.Record;
      id = ids ? ids[idx] : undefined ;
      ret.push(this.createRecord(recordType, dataHashes[idx], id));
    }
    return ret ;
  },


  /**
    Unloads a record, removing the data hash from the store.  If you try to
    unload a record that is already destroyed then this method will have no effect.
    If you unload a record that does not exist or an error then an exception
    will be raised.

    @param {SC.Record} recordType the recordType
    @param {String} id the record id
    @param {Number} storeKey (optional) if passed, ignores recordType and id
    @returns {SC.Store} receiver
  */
  unloadRecord: function(recordType, id, storeKey, newStatus) {
    if (storeKey === undefined) storeKey = recordType.storeKeyFor(id);
    var status = this.readStatus(storeKey), K = SC.Record;
    newStatus = newStatus || K.EMPTY;
    // handle status - ignore if destroying or destroyed
    if ((status === K.BUSY_DESTROYING) || (status & K.DESTROYED)) {
      return this; // nothing to do

    // error out if empty
    } else if (status & K.BUSY) {
      throw K.BUSY_ERROR ;

    // otherwise, destroy in dirty state
    } else status = newStatus ;

    // remove the data hash, set new status
    this.removeDataHash(storeKey, status);
    this.dataHashDidChange(storeKey);

    // Handle all the child Records
    var that = this;
    this._propagateToChildren(storeKey, function(storeKey){
      that.unloadRecord(null, null, storeKey, newStatus);
    });

    return this ;
  },

  /**
    Unloads a group of records.  If you have a set of record ids, unloading
    them this way can be faster than retrieving each record and unloading
    it individually.

    You can pass either a single `recordType` or an array of `recordType`s. If
    you pass a single `recordType`, then the record type will be used for each
    record.  If you pass an array, then each id must have a matching record
    type in the array.

    You can optionally pass an array of `storeKey`s instead of the `recordType`
    and ids.  In this case the first two parameters will be ignored.  This
    is usually only used by low-level internal methods.  You will not usually
    unload records this way.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids (optional) ids to unload
    @param {Array} storeKeys (optional) store keys to unload
    @returns {SC.Store} receiver
  */
  unloadRecords: function(recordTypes, ids, storeKeys, newStatus) {
    var len, isArray, idx, id, recordType, storeKey;

    if (storeKeys === undefined) {
      isArray = SC.typeOf(recordTypes) === 'array';
      if (!isArray) recordType = recordTypes;
      if (ids === undefined) {
        len = isArray ? recordTypes.length : 1;
        for (idx = 0; idx < len; idx++) {
          if (isArray) recordType = recordTypes[idx];
          storeKeys = this.storeKeysFor(recordType);
          this.unloadRecords(undefined, undefined, storeKeys, newStatus);
        }
      } else {
        len = ids.length;
        for (idx = 0; idx < len; idx++) {
          if (isArray) recordType = recordTypes[idx] || SC.Record;
          id = ids ? ids[idx] : undefined;
          this.unloadRecord(recordType, id, undefined, newStatus);
        }
      }
    } else {
      len = storeKeys.length;
      for (idx = 0; idx < len; idx++) {
        storeKey = storeKeys ? storeKeys[idx] : undefined;
        this.unloadRecord(undefined, undefined, storeKey, newStatus);
      }
    }

    return this;
  },

  /**
    Destroys a record, removing the data hash from the store and adding the
    record to the destroyed changelog.  If you try to destroy a record that is
    already destroyed then this method will have no effect.  If you destroy a
    record that does not exist or an error then an exception will be raised.

    @param {SC.Record} recordType the recordType
    @param {String} id the record id
    @param {Number} storeKey (optional) if passed, ignores recordType and id
    @returns {SC.Store} receiver
  */
  destroyRecord: function(recordType, id, storeKey) {
    if (storeKey === undefined) storeKey = recordType.storeKeyFor(id);
    var status = this.readStatus(storeKey), changelog, K = SC.Record;

    // handle status - ignore if destroying or destroyed
    if ((status === K.BUSY_DESTROYING) || (status & K.DESTROYED)) {
      return this; // nothing to do

    // error out if empty
    } else if (status === K.EMPTY) {
      throw K.NOT_FOUND_ERROR ;

    // error out if busy
    } else if (status & K.BUSY) {
      throw K.BUSY_ERROR ;

    // if new status, destroy but leave in clean state
    } else if (status === K.READY_NEW) {
      status = K.DESTROYED_CLEAN ;

    // otherwise, destroy in dirty state
    } else status = K.DESTROYED_DIRTY ;

    // remove the data hash, set new status
    this.writeStatus(storeKey, status);
    this.dataHashDidChange(storeKey);

    // add/remove change log
    changelog = this.changelog;
    if (!changelog) changelog = this.changelog = SC.Set.create();

    ((status & K.DIRTY) ? changelog.add(storeKey) : changelog.remove(storeKey));
    this.changelog=changelog;

    // if commit records is enabled
    if(get(this, 'commitRecordsAutomatically')){
      SC.run.schedule('actions', this, this.commitRecords);
    }

    var that = this;
    this._propagateToChildren(storeKey, function(storeKey){
      that.destroyRecord(null, null, storeKey);
    });

    return this ;
  },

  /**
    Destroys a group of records.  If you have a set of record ids, destroying
    them this way can be faster than retrieving each record and destroying
    it individually.

    You can pass either a single `recordType` or an array of `recordType`s. If
    you pass a single `recordType`, then the record type will be used for each
    record.  If you pass an array, then each id must have a matching record
    type in the array.

    You can optionally pass an array of `storeKey`s instead of the `recordType`
    and ids.  In this case the first two parameters will be ignored.  This
    is usually only used by low-level internal methods.  You will not usually
    destroy records this way.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} receiver
  */
  destroyRecords: function(recordTypes, ids, storeKeys) {
    var len, isArray, idx, id, recordType, storeKey;
    if(storeKeys===undefined){
      len = ids.length;
      isArray = SC.typeOf(recordTypes) === 'array';
      if (!isArray) recordType = recordTypes;
      for(idx=0;idx<len;idx++) {
        if (isArray) recordType = recordTypes[idx] || SC.Record;
        id = ids ? ids[idx] : undefined ;
        this.destroyRecord(recordType, id, undefined);
      }
    }else{
      len = storeKeys.length;
      for(idx=0;idx<len;idx++) {
        storeKey = storeKeys ? storeKeys[idx] : undefined ;
        this.destroyRecord(undefined, undefined, storeKey);
      }
    }
    return this ;
  },

  /**
    register a Child Record to the parent
  */
  registerChildToParent: function(parentStoreKey, childStoreKey, path){
    var prs, crs, oldPk, oldChildren, pkRef;
    // Check the child to see if it has a parent
    crs = this.childRecords || {};
    prs = this.parentRecords || {};
    // first rid of the old parent
    oldPk = crs[childStoreKey];
    if (oldPk){
      oldChildren = prs[oldPk];
      delete oldChildren[childStoreKey];
      // this.recordDidChange(null, null, oldPk, key);
    }
    pkRef = prs[parentStoreKey] || {};
    pkRef[childStoreKey] = path || YES;
    prs[parentStoreKey] = pkRef;
    crs[childStoreKey] = parentStoreKey;
    // sync the status of the child
    this.writeStatus(childStoreKey, this.statuses[parentStoreKey]);
    this.childRecords = crs;
    this.parentRecords = prs;
  },

  /**
    materialize the parent when passing in a store key for the child
  */
  materializeParentRecord: function(childStoreKey){
    var pk, crs;
    if (none(childStoreKey)) return null;
    crs = this.childRecords;
    pk = crs ? this.childRecords[childStoreKey] : null ;
    if (none(pk)) return null;

    return this.materializeRecord(pk);
  },

  /**
    function for retrieving a parent record key

    @param {Number} storeKey The store key of the parent
  */
  parentStoreKeyExists: function(storeKey){
    if (none(storeKey)) return ;
    var crs = this.childRecords || {};
    return crs[storeKey];
  },

  /**
    function that propagates a function call to all children
  */
  _propagateToChildren: function(storeKey, func){
    // Handle all the child Records
    if ( none(this.parentRecords) ) return;
    var children = this.parentRecords[storeKey] || {};
    if (none(func)) return;
    for (var key in children) {
      if (children.hasOwnProperty(key)) func(key);
    }
  },

  /**
    Notes that the data for the given record id has changed.  The record will
    be committed to the server the next time you commit the root store.  Only
    call this method on a record in a READY state of some type.

    @param {SC.Record} recordType the recordType
    @param {String} id the record id
    @param {Number} storeKey (optional) if passed, ignores recordType and id
    @param {String} key that changed (optional)
    @param {Boolean} if the change is to statusOnly (optional)
    @returns {SC.Store} receiver
  */
  recordDidChange: function(recordType, id, storeKey, key, statusOnly) {
    if (storeKey === undefined) storeKey = recordType.storeKeyFor(id);
    var status = this.readStatus(storeKey), changelog, K = SC.Record;

    // BUSY_LOADING, BUSY_CREATING, BUSY_COMMITTING, BUSY_REFRESH_CLEAN
    // BUSY_REFRESH_DIRTY, BUSY_DESTROYING
    if (status & K.BUSY) {
      throw K.BUSY_ERROR ;

    // if record is not in ready state, then it is not found.
    // ERROR, EMPTY, DESTROYED_CLEAN, DESTROYED_DIRTY
    } else if (!(status & K.READY)) {
      throw K.NOT_FOUND_ERROR ;

    // otherwise, make new status READY_DIRTY unless new.
    // K.READY_CLEAN, K.READY_DIRTY, ignore K.READY_NEW
    } else {
      if (status != K.READY_NEW) this.writeStatus(storeKey, K.READY_DIRTY);
    }

    // record data hash change
    this.dataHashDidChange(storeKey, null, statusOnly, key);

    // record in changelog
    changelog = this.changelog ;
    if (!changelog) changelog = this.changelog = SC.Set.create() ;
    changelog.add(storeKey);
    this.changelog = changelog;

    // if commit records is enabled
    if(get(this, 'commitRecordsAutomatically')){
      SC.run.schedule('actions', this, this.commitRecords);
    }

    return this ;
  },

  /**
    Mark a group of records as dirty.  The records will be committed to the
    server the next time you commit changes on the root store.  If you have a
    set of record ids, marking them dirty this way can be faster than
    retrieving each record and destroying it individually.

    You can pass either a single `recordType` or an array of `recordType`s. If
    you pass a single `recordType`, then the record type will be used for each
    record.  If you pass an array, then each id must have a matching record
    type in the array.

    You can optionally pass an array of `storeKey`s instead of the `recordType`
    and ids.  In this case the first two parameters will be ignored.  This
    is usually only used by low-level internal methods.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} receiver
  */
  recordsDidChange: function(recordTypes, ids, storeKeys) {
     var len, isArray, idx, id, recordType, storeKey;
      if(storeKeys===undefined){
        len = ids.length;
        isArray = SC.typeOf(recordTypes) === 'array';
        if (!isArray) recordType = recordTypes;
        for(idx=0;idx<len;idx++) {
          if (isArray) recordType = recordTypes[idx] || SC.Record;
          id = ids ? ids[idx] : undefined ;
          storeKey = storeKeys ? storeKeys[idx] : undefined ;
          this.recordDidChange(recordType, id, storeKey);
        }
      }else{
        len = storeKeys.length;
        for(idx=0;idx<len;idx++) {
          storeKey = storeKeys ? storeKeys[idx] : undefined ;
          this.recordDidChange(undefined, undefined, storeKey);
        }
      }
      return this ;
  },

  /**
    Retrieves a set of records from the server.  If the records has
    already been loaded in the store, then this method will simply return.
    Otherwise if your store has a `dataSource`, this will call the
    `dataSource` to retrieve the record.  Generally you will not need to
    call this method yourself. Instead you can just use `find()`.

    This will not actually create a record instance but it will initiate a
    load of the record from the server.  You can subsequently get a record
    instance itself using `materializeRecord()`.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to retrieve
    @param {Array} storeKeys (optional) store keys to retrieve
    @param {Boolean} isRefresh
    @param {Function|Array} callback function or array of functions
    @returns {Array} storeKeys to be retrieved
  */
  retrieveRecords: function(recordTypes, ids, storeKeys, isRefresh, callbacks) {

    var source  = this._getDataSource(),
        isArray = SC.typeOf(recordTypes) === 'array',
        hasCallbackArray = SC.typeOf(callbacks) === 'array',
        len     = (!storeKeys) ? ids.length : storeKeys.length,
        ret     = [],
        rev     = SC.Store.generateStoreKey(),
        K       = SC.Record,
        recordType, idx, storeKey, status, ok, callback;

    if (!isArray) recordType = recordTypes;

    // if no storeKeys were passed, map recordTypes + ids
    for(idx=0;idx<len;idx++) {

      // collect store key
      if (storeKeys) {
        storeKey = storeKeys[idx];
      } else {
        if (isArray) recordType = recordTypes[idx];
        storeKey = recordType.storeKeyFor(ids[idx]);
      }
      //collect the callback
      callback = hasCallbackArray ? callbacks[idx] : callbacks;

      // collect status and process
      status = this.readStatus(storeKey);

      // K.EMPTY, K.ERROR, K.DESTROYED_CLEAN - initial retrieval
      if ((status == K.EMPTY) || (status == K.ERROR) || (status == K.DESTROYED_CLEAN)) {
        this.writeStatus(storeKey, K.BUSY_LOADING);
        this.dataHashDidChange(storeKey, rev, YES);
        ret.push(storeKey);
        this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
      // otherwise, ignore record unless isRefresh is YES.
      } else if (isRefresh) {
        // K.READY_CLEAN, K.READY_DIRTY, ignore K.READY_NEW
        if (status & K.READY) {
          this.writeStatus(storeKey, K.BUSY_REFRESH | (status & 0x03)) ;
          this.dataHashDidChange(storeKey, rev, YES);
          ret.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        // K.BUSY_DESTROYING, K.BUSY_COMMITTING, K.BUSY_CREATING
        } else if ((status == K.BUSY_DESTROYING) || (status == K.BUSY_CREATING) || (status == K.BUSY_COMMITTING)) {
          throw K.BUSY_ERROR ;

        // K.DESTROY_DIRTY, bad state...
        } else if (status == K.DESTROYED_DIRTY) {
          throw K.BAD_STATE_ERROR ;

        // ignore K.BUSY_LOADING, K.BUSY_REFRESH_CLEAN, K.BUSY_REFRESH_DIRTY
        }
      }
    }

    // now retrieve storekeys from dataSource.  if there is no dataSource,
    // then act as if we couldn't retrieve.
    ok = NO;
    if (source) ok = source.retrieveRecords.call(source, this, ret, ids);

    // if the data source could not retrieve or if there is no source, then
    // simulate the data source calling dataSourceDidError on those we are
    // loading for the first time or dataSourceDidComplete on refreshes.
    if (!ok) {
      len = ret.length;
      rev = SC.Store.generateStoreKey();
      for(idx=0;idx<len;idx++) {
        storeKey = ret[idx];
        status   = this.readStatus(storeKey);
        if (status === K.BUSY_LOADING) {
          this.writeStatus(storeKey, K.ERROR);
          this.dataHashDidChange(storeKey, rev, YES);

        } else if (status & K.BUSY_REFRESH) {
          this.writeStatus(storeKey, K.READY | (status & 0x03));
          this.dataHashDidChange(storeKey, rev, YES);
        }
      }
      ret.length = 0 ; // truncate to indicate that none could refresh
    }
    return ret ;
  },

  _TMP_RETRIEVE_ARRAY: [],

  _callback_queue: {},

  /**
    @private
    stores the callbacks for the storeKeys that are inflight
  **/
  _setCallbackForStoreKey: function(storeKey, callback, hasCallbackArray, storeKeys){
    var queue = this._callback_queue;
    if(hasCallbackArray) queue[storeKey] = {callback: callback, otherKeys: storeKeys};
    else queue[storeKey] = callback;
  },
  /**
    @private
    retreives and calls callback for `storkey` if exists
    also handles if a single callback is need for one key
  **/
  _retreiveCallbackForStoreKey: function(storeKey){
    var queue = this._callback_queue,
        callback = queue[storeKey],
        allFinished, keys;
    if(callback){
      if(SC.typeOf(callback) === 'function'){
        callback.call(); //args?
        delete queue[storeKey]; //cleanup
      }
      else if(SC.typeOf(callback) == 'object'){
        callback.completed = YES;
        keys = callback.storeKeys;
        keys.forEach(function(key){
          if(!queue[key].completed) allFinished = YES;
        });
        if(allFinished){
          callback.callback.call(); // args?
          //cleanup
          keys.forEach(function(key){
            delete queue[key];
          });
        }

      }
    }
  },

  /*
    @private

  */
  _cancelCallback: function(storeKey){
    var queue = this._callback_queue;
    if(queue[storeKey]){
      delete queue[storeKey];
    }
  },


  /**
    Retrieves a record from the server.  If the record has already been loaded
    in the store, then this method will simply return.  Otherwise if your
    store has a `dataSource`, this will call the `dataSource` to retrieve the
    record.  Generally you will not need to call this method yourself.
    Instead you can just use `find()`.

    This will not actually create a record instance but it will initiate a
    load of the record from the server.  You can subsequently get a record
    instance itself using `materializeRecord()`.

    @param {SC.Record} recordType class
    @param {String} id id to retrieve
    @param {Number} storeKey (optional) store key
    @param {Boolean} isRefresh
    @param {Function} callback (optional)
    @returns {Number} storeKey that was retrieved
  */
  retrieveRecord: function(recordType, id, storeKey, isRefresh, callback) {
    var array = this._TMP_RETRIEVE_ARRAY,
        ret;

    if (storeKey) {
      array[0] = storeKey;
      storeKey = array;
      id = null ;
    } else {
      array[0] = id;
      id = array;
    }

    ret = this.retrieveRecords(recordType, id, storeKey, isRefresh, callback);
    array.length = 0 ;
    return ret[0];
  },

  /**
    Refreshes a record from the server.  If the record has already been loaded
    in the store, then this method will request a refresh from the
    `dataSource`. Otherwise it will attempt to retrieve the record.

    @param {String} id to id of the record to load
    @param {SC.Record} recordType the expected record type
    @param {Number} storeKey (optional) optional store key
    @param {Function} callback (optional) when refresh complets
    @returns {Boolean} YES if the retrieval was a success.
  */
  refreshRecord: function(recordType, id, storeKey, callback) {
    return !!this.retrieveRecord(recordType, id, storeKey, YES, callback);
  },

  /**
    Refreshes a set of records from the server.  If the records has already been loaded
    in the store, then this method will request a refresh from the
    `dataSource`. Otherwise it will attempt to retrieve them.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @param {Function} callback (optional) when refresh complets
    @returns {Boolean} YES if the retrieval was a success.
  */
  refreshRecords: function(recordTypes, ids, storeKeys, callback) {
    var ret = this.retrieveRecords(recordTypes, ids, storeKeys, YES, callback);
    return ret && ret.length>0;
  },

  /**
    Commits the passed store keys or ids. If no `storeKey`s are given,
    it will commit any records in the changelog.

    Based on the current state of the record, this will ask the data
    source to perform the appropriate actions
    on the store keys.

    @param {Array} recordTypes the expected record types (SC.Record)
    @param {Array} ids to commit
    @param {SC.Set} storeKeys to commit
    @param {Hash} params optional additional parameters to pass along to the
      data source
    @param {Function|Array} callback function or array of callbacks

    @returns {Boolean} if the action was succesful.
  */
  commitRecords: function(recordTypes, ids, storeKeys, params, callbacks) {
    var source    = this._getDataSource(),
        isArray   = SC.typeOf(recordTypes) === 'array',
        hasCallbackArray = SC.typeOf(callbacks) === 'array',
        retCreate= [], retUpdate= [], retDestroy = [],
        rev       = SC.Store.generateStoreKey(),
        K         = SC.Record,
        recordType, idx, storeKey, status, key, ret, len, callback;

    // If no params are passed, look up storeKeys in the changelog property.
    // Remove any committed records from changelog property.

    if(!recordTypes && !ids && !storeKeys){
      storeKeys = this.changelog;
    }

    len = storeKeys ? get(storeKeys, 'length') : (ids ? get(ids, 'length') : 0);

    for(idx=0;idx<len;idx++) {

      // collect store key
      if (storeKeys) {
        storeKey = storeKeys[idx];
      } else {
        if (isArray) recordType = recordTypes[idx] || SC.Record;
        else recordType = recordTypes;
        storeKey = recordType.storeKeyFor(ids[idx]);
      }

      //collect the callback
      callback = hasCallbackArray ? callbacks[idx] : callbacks;

      // collect status and process
      status = this.readStatus(storeKey);

      if ((status == K.EMPTY) || (status == K.ERROR)) {
        throw K.NOT_FOUND_ERROR ;
      }
      else {
        if(status==K.READY_NEW) {
          this.writeStatus(storeKey, K.BUSY_CREATING);
          this.dataHashDidChange(storeKey, rev, YES);
          retCreate.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        } else if (status==K.READY_DIRTY) {
          this.writeStatus(storeKey, K.BUSY_COMMITTING);
          this.dataHashDidChange(storeKey, rev, YES);
          retUpdate.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        } else if (status==K.DESTROYED_DIRTY) {
          this.writeStatus(storeKey, K.BUSY_DESTROYING);
          this.dataHashDidChange(storeKey, rev, YES);
          retDestroy.push(storeKey);
          this._setCallbackForStoreKey(storeKey, callback, hasCallbackArray, storeKeys);
        } else if (status==K.DESTROYED_CLEAN) {
          this.dataHashDidChange(storeKey, rev, YES);
        }
        // ignore K.READY_CLEAN, K.BUSY_LOADING, K.BUSY_CREATING, K.BUSY_COMMITTING,
        // K.BUSY_REFRESH_CLEAN, K_BUSY_REFRESH_DIRTY, KBUSY_DESTROYING
      }
    }

    // now commit storekeys to dataSource
    if (source && (len>0 || params)) {
      ret = source.commitRecords.call(source, this, retCreate, retUpdate, retDestroy, params);
    }

    //remove all commited changes from changelog
    if (ret && !recordTypes && !ids) {
      if (storeKeys === this.changelog) {
        this.changelog = null;
      }
      else {
        this.changelog.removeEach(storeKeys);
      }
    }
    return ret ;
  },

  /**
    Commits the passed store key or id.  Based on the current state of the
    record, this will ask the data source to perform the appropriate action
    on the store key.

    You have to pass either the id or the storeKey otherwise it will return
    NO.

    @param {SC.Record} recordType the expected record type
    @param {String} id the id of the record to commit
    @param {Number} storeKey the storeKey of the record to commit
    @param {Hash} params optional additonal params that will passed down
      to the data source
    @param {Function|Array} callback function or array of functions
    @returns {Boolean} if the action was successful.
  */
  commitRecord: function(recordType, id, storeKey, params, callback) {
    var array = this._TMP_RETRIEVE_ARRAY,
        ret ;
    if (id === undefined && storeKey === undefined ) return NO;
    if (storeKey !== undefined) {
      array[0] = storeKey;
      storeKey = array;
      id = null ;
    } else {
      array[0] = id;
      id = array;
    }

    ret = this.commitRecords(recordType, id, storeKey, params, callback);
    array.length = 0 ;
    return ret;
  },

  /**
    Cancels an inflight request for the passed records.  Depending on the
    server implementation, this could cancel an entire request, causing
    other records to also transition their current state.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} the store.
  */
  cancelRecords: function(recordTypes, ids, storeKeys) {
    var source  = this._getDataSource(),
        isArray = SC.typeOf(recordTypes) === 'array',
        K       = SC.Record,
        ret     = [],
        status, len, idx, id, recordType, storeKey;

    len = (storeKeys === undefined) ? ids.length : storeKeys.length;
    for(idx=0;idx<len;idx++) {
      if (isArray) recordType = recordTypes[idx] || SC.Record;
      else recordType = recordTypes || SC.Record;

      id = ids ? ids[idx] : undefined ;

      if(storeKeys===undefined){
        storeKey = recordType.storeKeyFor(id);
      }else{
        storeKey = storeKeys ? storeKeys[idx] : undefined ;
      }
      if(storeKey) {
        status = this.readStatus(storeKey);

        if ((status == K.EMPTY) || (status == K.ERROR)) {
          throw K.NOT_FOUND_ERROR ;
        }
        ret.push(storeKey);
        this._cancelCallback(storeKey);
      }
    }

    if (source) source.cancel.call(source, this, ret);

    return this ;
  },

  /**
    Cancels an inflight request for the passed record.  Depending on the
    server implementation, this could cancel an entire request, causing
    other records to also transition their current state.

    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} the store.
  */
  cancelRecord: function(recordType, id, storeKey) {
    var array = this._TMP_RETRIEVE_ARRAY,
        ret ;

    if (storeKey !== undefined) {
      array[0] = storeKey;
      storeKey = array;
      id = null ;
    } else {
      array[0] = id;
      id = array;
    }

    ret = this.cancelRecords(recordType, id, storeKey);
    array.length = 0 ;
    return this;
  },

  /**
    Convenience method can be called by the store or other parts of your
    application to load a record into the store.  This method will take a
    recordType and a data hashes and either add or update the
    record in the store.

    The loaded records will be in an `SC.Record.READY_CLEAN` state, indicating
    they were loaded from the data source and do not need to be committed
    back before changing.

    This method will check the state of the storeKey and call either
    `pushRetrieve()` or `dataSourceDidComplete()`.  The standard state constraints
    for these methods apply here.

    The return value will be the `storeKey` used for the push.  This is often
    convenient to pass into `loadQuery()`, if you are fetching a remote query.

    If you are upgrading from a pre SproutCore 1.0 application, this method
    is the closest to the old `updateRecord()`.

    @param {SC.Record} recordType the record type
    @param {Array} dataHash to update
    @param {Array} id optional.  if not passed lookup on the hash
    @returns {String} store keys assigned to these id
  */
  loadRecord: function(recordType, dataHash, id) {
    var K       = SC.Record,
        ret, primaryKey, storeKey;

    // save lookup info
    recordType = recordType || SC.Record;
    primaryKey = get(recordType, 'proto').primaryKey;


    // push each record
    id = id || dataHash[primaryKey];
    ret = storeKey = recordType.storeKeyFor(id); // needed to cache

    if (this.readStatus(storeKey) & K.BUSY) {
      this.dataSourceDidComplete(storeKey, dataHash, id);
    } else this.pushRetrieve(recordType, id, dataHash, storeKey);

    // return storeKey
    return ret ;
  },

  /**
    Convenience method can be called by the store or other parts of your
    application to load records into the store.  This method will take a
    recordType and an array of data hashes and either add or update the
    record in the store.

    The loaded records will be in an `SC.Record.READY_CLEAN` state, indicating
    they were loaded from the data source and do not need to be committed
    back before changing.

    This method will check the state of each storeKey and call either
    `pushRetrieve()` or `dataSourceDidComplete()`.  The standard state
    constraints for these methods apply here.

    The return value will be the storeKeys used for each push.  This is often
    convenient to pass into `loadQuery()`, if you are fetching a remote query.

    If you are upgrading from a pre SproutCore 1.0 application, this method
    is the closest to the old `updateRecords()`.

    @param {SC.Record} recordTypes the record type or array of record types
    @param {Array} dataHashes array of data hashes to update
    @param {Array} ids optional array of ids.  if not passed lookup on hashes
    @returns {Array} store keys assigned to these ids
  */
  loadRecords: function(recordTypes, dataHashes, ids) {
    var isArray = SC.typeOf(recordTypes) === 'array',
        len     = get(dataHashes, 'length'),
        ret     = [],
        K       = SC.Record,
        recordType, id, primaryKey, idx, dataHash, storeKey;

    // save lookup info
    if (!isArray) {
      recordType = recordTypes || SC.Record;
      primaryKey = get(recordType, 'proto').primaryKey ;
    }

    // push each record
    for(idx=0;idx<len;idx++) {
      dataHash = dataHashes.objectAt(idx);
      if (isArray) {
        recordType = recordTypes.objectAt(idx) || SC.Record;
        primaryKey = get(recordType, 'proto').primaryKey ;
      }
      id = (ids) ? ids.objectAt(idx) : dataHash[primaryKey];
      ret[idx] = this.loadRecord(recordType, dataHash, id);

    }

    // return storeKeys
    return ret ;
  },

  /**
    Returns the `SC.StoreError` object associated with a specific record.

    @param {Number} storeKey The store key of the record.

    @returns {SC.StoreError} SC.StoreError or undefined if no error associated with the record.
  */
  readError: function(storeKey) {
    var errors = this.recordErrors ;
    return errors ? errors[storeKey] : undefined ;
  },

  /**
    Returns the `SC.StoreError` object associated with a specific query.

    @param {SC.Query} query The SC.Query with which the error is associated.

    @returns {SC.StoreError} SC.StoreError or undefined if no error associated with the query.
  */
  readQueryError: function(query) {
    var errors = this.queryErrors ;
    return errors ? errors[SC.guidFor(query)] : undefined ;
  },

  // ..........................................................
  // DATA SOURCE CALLBACKS
  //
  // Mathods called by the data source on the store

  /**
    Called by a `dataSource` when it cancels an inflight operation on a
    record.  This will transition the record back to it non-inflight state.

    @param {Number} storeKey record store key to cancel
    @returns {SC.Store} reciever
  */
  dataSourceDidCancel: function(storeKey) {
    var status = this.readStatus(storeKey),
        K      = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }

    // otherwise, determine proper state transition
    switch(status) {
      case K.BUSY_LOADING:
        status = K.EMPTY;
        break ;

      case K.BUSY_CREATING:
        status = K.READY_NEW;
        break;

      case K.BUSY_COMMITTING:
        status = K.READY_DIRTY ;
        break;

      case K.BUSY_REFRESH_CLEAN:
        status = K.READY_CLEAN;
        break;

      case K.BUSY_REFRESH_DIRTY:
        status = K.READY_DIRTY ;
        break ;

      case K.BUSY_DESTROYING:
        status = K.DESTROYED_DIRTY ;
        break;

      default:
        throw K.BAD_STATE_ERROR ;
    }
    this.writeStatus(storeKey, status) ;
    this.dataHashDidChange(storeKey, null, YES);
    this._cancelCallback(storeKey);

    return this ;
  },

  /**
    Called by a data source when it creates or commits a record.  Passing an
    optional id will remap the `storeKey` to the new record id.  This is
    required when you commit a record that does not have an id yet.

    @param {Number} storeKey record store key to change to READY_CLEAN state
    @param {Hash} dataHash optional data hash to replace current hash
    @param {Object} newId optional new id to replace the old one
    @returns {SC.Store} reciever
  */
  dataSourceDidComplete: function(storeKey, dataHash, newId) {
    var status = this.readStatus(storeKey), K = SC.Record, statusOnly;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }

    // otherwise, determine proper state transition
    if(status===K.BUSY_DESTROYING) {
      throw K.BAD_STATE_ERROR ;
    } else status = K.READY_CLEAN ;

    this.writeStatus(storeKey, status) ;
    if (dataHash) this.writeDataHash(storeKey, dataHash, status) ;
    if (newId) SC.Store.replaceIdFor(storeKey, newId);

    statusOnly = dataHash || newId ? NO : YES;
    this.dataHashDidChange(storeKey, null, statusOnly);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);
    if (!none(record)) {
      record.notifyPropertyChange('status');
    }
    //update callbacks
    this._retreiveCallbackForStoreKey(storeKey);

    return this ;
  },

  /**
    Called by a data source when it has destroyed a record.  This will
    transition the record to the proper state.

    @param {Number} storeKey record store key to cancel
    @returns {SC.Store} reciever
  */
  dataSourceDidDestroy: function(storeKey) {
    var status = this.readStatus(storeKey), K = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }
    // otherwise, determine proper state transition
    else{
      status = K.DESTROYED_CLEAN ;
    }
    this.removeDataHash(storeKey, status) ;
    this.dataHashDidChange(storeKey);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);
    if (!none(record)) {
      record.notifyPropertyChange('status');
    }

    this._retreiveCallbackForStoreKey(storeKey);

    return this ;
  },

  /**
    Converts the passed record into an error object.

    @param {Number} storeKey record store key to error
    @param {SC.StoreError} error [optional] an SC.StoreError instance to associate with storeKey
    @returns {SC.Store} reciever
  */
  dataSourceDidError: function(storeKey, error) {
    var status = this.readStatus(storeKey), errors = this.recordErrors, K = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) { throw K.BAD_STATE_ERROR; }

    // otherwise, determine proper state transition
    else status = K.ERROR ;

    // Add the error to the array of record errors (for lookup later on if necessary).
    if (error && error.isError) {
      if (!errors) errors = this.recordErrors = [];
      errors[storeKey] = error;
    }

    this.writeStatus(storeKey, status) ;
    this.dataHashDidChange(storeKey, null, YES);

    // Force record to refresh its cached properties based on store key
    var record = this.materializeRecord(storeKey);
    if (!none(record)) {
      record.notifyPropertyChange('status');
    }

    this._retreiveCallbackForStoreKey(storeKey);
    return this ;
  },

  // ..........................................................
  // PUSH CHANGES FROM DATA SOURCE
  //

  /**
    Call by the data source whenever you want to push new data out of band
    into the store.

    @param {Class} recordType the SC.Record subclass
    @param {Object} id the record id or null
    @param {Hash} dataHash data hash to load
    @param {Number} storeKey optional store key.
    @returns {Number|Boolean} storeKey if push was allowed, NO if not
  */
  pushRetrieve: function(recordType, id, dataHash, storeKey) {
    var K = SC.Record, status;

    if(storeKey===undefined) storeKey = recordType.storeKeyFor(id);
    status = this.readStatus(storeKey);
    if(status==K.EMPTY || status==K.ERROR || status==K.READY_CLEAN || status==K.DESTROYED_CLEAN) {

      status = K.READY_CLEAN;
      if(dataHash===undefined) this.writeStatus(storeKey, status) ;
      else this.writeDataHash(storeKey, dataHash, status) ;

      this.dataHashDidChange(storeKey);

      return storeKey;
    }
    //conflicted (ready)
    return NO;
  },

  /**
    Call by the data source whenever you want to push a deletion into the
    store.

    @param {Class} recordType the SC.Record subclass
    @param {Object} id the record id or null
    @param {Number} storeKey optional store key.
    @returns {Number|Boolean} storeKey if push was allowed, NO if not
  */
  pushDestroy: function(recordType, id, storeKey) {
    var K = SC.Record, status;

    if(storeKey===undefined){
      storeKey = recordType.storeKeyFor(id);
    }
    status = this.readStatus(storeKey);
    if(status==K.EMPTY || status==K.ERROR || status==K.READY_CLEAN || status==K.DESTROYED_CLEAN){
      status = K.DESTROYED_CLEAN;
      this.removeDataHash(storeKey, status) ;
      this.dataHashDidChange(storeKey);
      return storeKey;
    }
    //conflicted (destroy)
    return NO;
  },

  /**
    Call by the data source whenever you want to push an error into the
    store.

    @param {Class} recordType the SC.Record subclass
    @param {Object} id the record id or null
    @param {SC.StoreError} error [optional] an SC.StoreError instance to associate with id or storeKey
    @param {Number} storeKey optional store key.
    @returns {Number|Boolean} storeKey if push was allowed, NO if not
  */
  pushError: function(recordType, id, error, storeKey) {
    var K = SC.Record, status, errors = this.recordErrors;

    if(storeKey===undefined) storeKey = recordType.storeKeyFor(id);
    status = this.readStatus(storeKey);

    if(status==K.EMPTY || status==K.ERROR || status==K.READY_CLEAN || status==K.DESTROYED_CLEAN){
      status = K.ERROR;

      // Add the error to the array of record errors (for lookup later on if necessary).
      if (error && error.isError) {
        if (!errors) errors = this.recordErrors = [];
        errors[storeKey] = error;
      }

      this.writeStatus(storeKey, status) ;
      this.dataHashDidChange(storeKey, null, YES);
      return storeKey;
    }
    //conflicted (error)
    return NO;
  },

  // ..........................................................
  // FETCH CALLBACKS
  //

  // **NOTE**: although these method works on RecordArray instances right now.
  // They could be optimized to actually share query results between nested
  // stores.  This is why these methods are implemented here instead of
  // directly on `Query` or `RecordArray` objects.

  /**
    Sets the passed array of storeKeys as the new data for the query.  You
    can call this at any time for a remote query to update its content.  If
    you want to use incremental loading, then pass a `SparseArray` object.

    If the query you pass is not a REMOTE query, then this method will raise
    an exception.  This will also implicitly transition the query state to
    `SC.Record.READY`.

    If you called `loadRecords()` before to load the actual content, you can
    call this method with the return value of that method to actually set the
    storeKeys on the result.

    @param {SC.Query} query the query you are loading.  must be remote.
    @param {SC.Array} storeKeys array of store keys
    @returns {SC.Store} receiver
  */
  loadQueryResults: function(query, storeKeys) {
    if (get(query, 'location') === SC.Query.LOCAL) {
      throw new Error("Cannot load query results for a local query");
    }

    var recArray = this._findQuery(query, YES, NO);
    if (recArray) set(recArray, 'storeKeys', storeKeys);
    this.dataSourceDidFetchQuery(query);

    return this ;
  },

  /**
    Called by your data source whenever you finish fetching the results of a
    query.  This will put the query into a READY state if it was loading.

    Note that if the query is a REMOTE query, then you must separately load
    the results into the query using `loadQueryResults()`.  If the query is
    LOCAL, then the query will update automatically with any new records you
    added to the store.

    @param {SC.Query} query the query you fetched
    @returns {SC.Store} receiver
  */
  dataSourceDidFetchQuery: function(query) {
    return this._scstore_dataSourceDidFetchQuery(query, YES);
  },

  _scstore_dataSourceDidFetchQuery: function(query, createIfNeeded) {
    var recArray     = this._findQuery(query, createIfNeeded, NO),
        nestedStores = get(this, 'nestedStores'),
        loc          = nestedStores ? get(nestedStores, 'length') : 0;

    // fix query if needed
    if (recArray) recArray.storeDidFetchQuery(query);

    // notify nested stores
    while(--loc >= 0) {
      nestedStores[loc]._scstore_dataSourceDidFetchQuery(query, NO);
    }

    return this ;
  },

  /**
    Called by your data source if it cancels fetching the results of a query.
    This will put any RecordArray's back into its original state (READY or
    EMPTY).

    @param {SC.Query} query the query you cancelled
    @returns {SC.Store} receiver
  */
  dataSourceDidCancelQuery: function(query) {
    return this._scstore_dataSourceDidCancelQuery(query, YES);
  },

  _scstore_dataSourceDidCancelQuery: function(query, createIfNeeded) {
    var recArray     = this._findQuery(query, createIfNeeded, NO),
        nestedStores = get(this, 'nestedStores'),
        loc          = nestedStores ? get(nestedStores, 'length') : 0;

    // fix query if needed
    if (recArray) recArray.storeDidCancelQuery(query);

    // notify nested stores
    while(--loc >= 0) {
      nestedStores[loc]._scstore_dataSourceDidCancelQuery(query, NO);
    }

    return this ;
  },

  /**
    Called by your data source if it encountered an error loading the query.
    This will put the query into an error state until you try to refresh it
    again.

    @param {SC.Query} query the query with the error
    @param {SC.StoreError} error [optional] an SC.StoreError instance to associate with query
    @returns {SC.Store} receiver
  */
  dataSourceDidErrorQuery: function(query, error) {
    var errors = this.queryErrors;

    // Add the error to the array of query errors (for lookup later on if necessary).
    if (error && error.isError) {
      if (!errors) errors = this.queryErrors = {};
      errors[SC.guidFor(query)] = error;
    }

    return this._scstore_dataSourceDidErrorQuery(query, YES);
  },

  _scstore_dataSourceDidErrorQuery: function(query, createIfNeeded) {
    var recArray     = this._findQuery(query, createIfNeeded, NO),
        nestedStores = get(this, 'nestedStores'),
        loc          = nestedStores ? get(nestedStores, 'length') : 0;

    // fix query if needed
    if (recArray) recArray.storeDidErrorQuery(query);

    // notify nested stores
    while(--loc >= 0) {
      nestedStores[loc]._scstore_dataSourceDidErrorQuery(query, NO);
    }

    return this ;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  init: function() {
    this._super();
    this.reset();
  },


  toString: function() {
    // Include the name if the client has specified one.
    var name = get(this, 'name');
    if (!name) {
      return this._super();
    }
    else {
      var ret = this._super();
      return "%@ (%@)".fmt(name, ret);
    }
  },


  // ..........................................................
  // PRIMARY KEY CONVENIENCE METHODS
  //

  /**
    Given a `storeKey`, return the `primaryKey`.

    @param {Number} storeKey the store key
    @returns {String} primaryKey value
  */
  idFor: function(storeKey) {
    return SC.Store.idFor(storeKey);
  },

  /**
    Given a storeKey, return the recordType.

    @param {Number} storeKey the store key
    @returns {SC.Record} record instance
  */
  recordTypeFor: function(storeKey) {
    return SC.Store.recordTypeFor(storeKey) ;
  },

  /**
    Given a `recordType` and `primaryKey`, find the `storeKey`. If the
    `primaryKey` has not been assigned a `storeKey` yet, it will be added.

    @param {SC.Record} recordType the record type
    @param {String} primaryKey the primary key
    @returns {Number} storeKey
  */
  storeKeyFor: function(recordType, primaryKey) {
    return recordType.storeKeyFor(primaryKey);
  },

  /**
    Given a `primaryKey` value for the record, returns the associated
    `storeKey`.  As opposed to `storeKeyFor()` however, this method
    will **NOT** generate a new `storeKey` but returned `undefined`.

    @param {SC.Record} recordType the record type
    @param {String} primaryKey the primary key
    @returns {Number} a storeKey.
  */
  storeKeyExists: function(recordType, primaryKey) {
    return recordType.storeKeyExists(primaryKey);
  },

  /**
    Finds all `storeKey`s of a certain record type in this store
    and returns an array.

    @param {SC.Record} recordType
    @returns {Array} set of storeKeys
  */
  storeKeysFor: function(recordType) {
    var ret = [],
        isEnum = recordType && recordType.isEnumerable,
        recType, storeKey, isMatch ;

    if (!this.statuses) return ret;
    for(storeKey in SC.Store.recordTypesByStoreKey) {
      recType = SC.Store.recordTypesByStoreKey[storeKey];

      // if same record type and this store has it
      if (isEnum) isMatch = recordType.contains(recType);
      else isMatch = recType === recordType;

      if(isMatch && this.statuses[storeKey]) ret.push(parseInt(storeKey, 10));
    }

    return ret;
  },

  /**
    Finds all `storeKey`s in this store
    and returns an array.

    @returns {Array} set of storeKeys
  */
  storeKeys: function() {
    var ret = [], storeKey;
    if(!this.statuses) return ret;

    for(storeKey in this.statuses) {
      // if status is not empty
      if(this.statuses[storeKey] != SC.Record.EMPTY) {
        ret.push(parseInt(storeKey, 10));
      }
    }

    return ret;
  },

  /**
    Returns string representation of a `storeKey`, with status.

    @param {Number} storeKey
    @returns {String}
  */
  statusString: function(storeKey) {
    var rec = this.materializeRecord(storeKey);
    return rec.statusString();
  }

}) ;

SC.Store.reopenClass(/** @scope SC.Store.prototype */{

  /**
    Standard error raised if you try to commit changes from a nested store
    and there is a conflict.

    @type Error
  */
  CHAIN_CONFLICT_ERROR: new Error("Nested Store Conflict"),

  /**
    Standard error if you try to perform an operation on a nested store
    without a parent.

    @type Error
  */
  NO_PARENT_STORE_ERROR: new Error("Parent Store Required"),

  /**
    Standard error if you try to perform an operation on a nested store that
    is only supported in root stores.

    @type Error
  */
  NESTED_STORE_UNSUPPORTED_ERROR: new Error("Unsupported In Nested Store"),

  /**
    Standard error if you try to retrieve a record in a nested store that is
    dirty.  (This is allowed on the main store, but not in nested stores.)

    @type Error
  */
  NESTED_STORE_RETRIEVE_DIRTY_ERROR: new Error("Cannot Retrieve Dirty Record in Nested Store"),

  /**
    Data hash state indicates the data hash is currently editable

    @type String
  */
  EDITABLE:  'editable',

  /**
    Data hash state indicates the hash no longer tracks changes from a
    parent store, but it is not editable.

    @type String
  */
  LOCKED:    'locked',

  /**
    Data hash state indicates the hash is tracking changes from the parent
    store and is not editable.

    @type String
  */
  INHERITED: 'inherited',

  /** @private
    This array maps all storeKeys to primary keys.  You will not normally
    access this method directly.  Instead use the `idFor()` and
    `storeKeyFor()` methods on `SC.Record`.
  */
  idsByStoreKey: [],

  /** @private
    Maps all `storeKey`s to a `recordType`.  Once a `storeKey` is associated
    with a `primaryKey` and `recordType` that remains constant throughout the
    lifetime of the application.
  */
  recordTypesByStoreKey: {},

  /** @private
    Maps some `storeKeys` to query instance.  Once a `storeKey` is associated
    with a query instance, that remains constant through the lifetime of the
    application.  If a `Query` is destroyed, it will remove itself from this
    list.

    Don't access this directly.  Use queryFor().
  */
  queriesByStoreKey: [],

  /** @private
    The next store key to allocate.  A storeKey must always be greater than 0
  */
  nextStoreKey: 1,

  /**
    Generates a new store key for use.

    @type Number
  */
  generateStoreKey: function() { return this.nextStoreKey++; },

  /**
    Given a `storeKey` returns the `primaryKey` associated with the key.
    If no `primaryKey` is associated with the `storeKey`, returns `null`.

    @param {Number} storeKey the store key
    @returns {String} the primary key or null
  */
  idFor: function(storeKey) {
    return this.idsByStoreKey[storeKey] ;
  },

  /**
    Given a `storeKey`, returns the query object associated with the key.  If
    no query is associated with the `storeKey`, returns `null`.

    @param {Number} storeKey the store key
    @returns {SC.Query} query query object
  */
  queryFor: function(storeKey) {
    return this.queriesByStoreKey[storeKey];
  },

  /**
    Given a `storeKey` returns the `SC.Record` class associated with the key.
    If no record type is associated with the store key, returns `null`.

    The SC.Record class will only be found if you have already called
    storeKeyFor() on the record.

    @param {Number} storeKey the store key
    @returns {SC.Record} the record type
  */
  recordTypeFor: function(storeKey) {
    return this.recordTypesByStoreKey[storeKey];
  },

  /**
    Swaps the `primaryKey` mapped to the given storeKey with the new
    `primaryKey`.  If the `storeKey` is not currently associated with a record
    this will raise an exception.

    @param {Number} storeKey the existing store key
    @param {String} newPrimaryKey the new primary key
    @returns {SC.Store} receiver
  */
  replaceIdFor: function(storeKey, newId) {
    var oldId = this.idsByStoreKey[storeKey],
        recordType, storeKeys;

    if (oldId !== newId) { // skip if id isn't changing

      recordType = this.recordTypeFor(storeKey);
       if (!recordType) {
        throw new Error("replaceIdFor: storeKey %@ does not exist".fmt(storeKey));
      }

      // map one direction...
      this.idsByStoreKey[storeKey] = newId;

      // then the other...
      storeKeys = recordType.storeKeysById() ;
      delete storeKeys[oldId];
      storeKeys[newId] = storeKey;
    }

    return this ;
  },

  /**
    Swaps the `recordType` recorded for a given `storeKey`.  Normally you
    should not call this method directly as it can damage the store behavior.
    This method is used by other store methods to set the `recordType` for a
    `storeKey`.

    @param {Integer} storeKey the store key
    @param {SC.Record} recordType a record class
    @returns {SC.Store} reciever
  */
  replaceRecordTypeFor: function(storeKey, recordType) {
    this.recordTypesByStoreKey[storeKey] = recordType;
    return this ;
  }

});


/** @private */
SC.Store.reopen({
  nextStoreIndex: 1
});

// ..........................................................
// COMPATIBILITY
//

/** @private
  global store is used only for deprecated compatibility methods.  Don't use
  this in real code.
*/
SC.Store._getDefaultStore = function() {
  var store = this._store;
  if(!store) this._store = store = SC.Store.create();
  return store;
};

/** @private

  DEPRECATED

  Included for compatibility, loads data hashes with the named `recordType`.
  If no `recordType` is passed, expects to find a `recordType` property in the
  data hashes.  `dataSource` and `isLoaded` params are ignored.

  Calls `SC.Store#loadRecords()` on the default store. Do not use this method in
  new code.

  @param {Array} dataHashes data hashes to import
  @param {Object} dataSource ignored
  @param {SC.Record} recordType default record type
  @param {Boolean} isLoaded ignored
  @returns {Array} SC.Record instances for loaded data hashes
*/
SC.Store.updateRecords = function(dataHashes, dataSource, recordType, isLoaded) {

  SC.Logger.warn("SC.Store.updateRecords() is deprecated.  Use loadRecords() instead");

  var store = this._getDefaultStore(),
      len   = dataHashes.length,
      idx, ret;

  // if no recordType was passed, build an array of recordTypes from hashes
  if (!recordType) {
    recordType = [];
    for(idx=0;idx<len;idx++) recordType[idx] = dataHashes[idx].recordType;
  }

  // call new API.  Returns storeKeys
  ret = store.loadRecords(recordType, dataHashes);

  // map to SC.Record instances
  len = ret.length;
  for(idx=0;idx<len;idx++) ret[idx] = store.materializeRecord(ret[idx]);

  return ret ;
};

/** @private

  DEPRECATED

  Finds a record with the passed guid on the default store.  This is included
  only for compatibility.  You should use the newer `find()` method defined on
  `SC.Store` instead.

  @param {String} guid the guid
  @param {SC.Record} recordType expected record type
  @returns {SC.Record} found record
*/
SC.Store.find = function(guid, recordType) {
  return this._getDefaultStore().find(recordType, guid);
};

/** @private

  DEPRECATED

  Passes through to `findAll` on default store.  This is included only for
  compatibility.  You should use the newer `findAll()` defined on `SC.Store`
  instead.

  @param {Hash} filter search parameters
  @param {SC.Record} recordType type of record to find
  @returns {SC.RecordArray} result set
*/
SC.Store.findAll = function(filter, recordType) {
  return this._getDefaultStore().findAll(filter, recordType);
};


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals sc_assert */

var get = SC.get, set = SC.set;

var o_create = SC.platform.create;

/**
  @class

  A nested store can buffer changes to a parent store and then commit them
  all at once.  You usually will use a `NestedStore` as part of store chaining
  to stage changes to your object graph before sharing them with the rest of
  the application.

  Normally you will not create a nested store directly.  Instead, you can
  retrieve a nested store by using the `chain()` method.  When you are finished
  working with the nested store, `destroy()` will dispose of it.

  @extends SC.Store
  @since SproutCore 1.0
*/
SC.NestedStore = SC.Store.extend(
/** @scope SC.NestedStore.prototype */ {

  /**
    This is set to YES when there are changes that have not been committed
    yet.

    @type Boolean
    @default NO
  */
  hasChanges: NO,

  /**
    The parent store this nested store is chained to.  Nested stores must have
    a parent store in order to function properly.  Normally, you create a
    nested store using the `SC.Store#chain()` method and this property will be
    set for you.

    @type SC.Store
    @default null
  */
  parentStore: null,

  /**
    `YES` if the view is nested. Walk like a duck

    @type Boolean
    @default YES
  */
  isNested: YES,

  /**
    If YES, then the attribute hash state will be locked when you first
    read the data hash or status.  This means that if you retrieve a record
    then change the record in the parent store, the changes will not be
    visible to your nested store until you commit or discard changes.

    If `NO`, then the attribute hash will lock only when you write data.

    Normally you want to lock your attribute hash the first time you read it.
    This will make your nested store behave most consistently.  However, if
    you are using multiple sibling nested stores at one time, you may want
    to turn off this property so that changes from one store will be reflected
    in the other one immediately.  In this case you will be responsible for
    ensuring that the sibling stores do not edit the same part of the object
    graph at the same time.

    @type Boolean
    @default YES
  */
  lockOnRead: YES,

  /** @private
    Array contains the base revision for an attribute hash when it was first
    cloned from the parent store.  If the attribute hash is edited and
    commited, the commit will fail if the parent attributes hash has been
    edited since.

    This is a form of optimistic locking, hence the name.

    Each store gets its own array of locks, which are selectively populated
    as needed.

    Note that this is kept as an array because it will be stored as a dense
    array on some browsers, making it faster.

    @type Array
    @default null
  */
  locks: null,

  /** @private
    An array that includes the store keys that have changed since the store
    was last committed.  This array is used to sync data hash changes between
    chained stores.  For a log changes that may actually be committed back to
    the server see the changelog property.

    @type SC.Set
    @default YES
  */
  chainedChanges: null,

  // ..........................................................
  // STORE CHAINING
  //

  /**
    `find()` cannot accept REMOTE queries in a nested store.  This override will
    verify that condition for you.  See `SC.Store#find()` for info on using this
    method.

    @param {SC.Query} query query object to use.
    @returns {SC.Record|SC.RecordArray}
  */
  find: function(query) {
    sc_assert("SC.Store#find() can only accept LOCAL queries in nested stores",
      !query || !(query instanceof SC.Query) || get(query, 'location') === SC.Query.LOCAL);
    return this._super.apply(this, arguments);
  },

  /**
    Propagate this store's changes to its parent.  If the store does not
    have a parent, this has no effect other than to clear the change set.

    @param {Boolean} force if YES, does not check for conflicts first
    @returns {SC.Store} receiver
  */
  commitChanges: function(force) {
    if (get(this, 'hasChanges')) {
      var pstore = get(this, 'parentStore');
      pstore.commitChangesFromNestedStore(this, this.chainedChanges, force);
    }

    // clear out custom changes - even if there is nothing to commit.
    this.reset();
    return this ;
  },

  /**
    Discard the changes made to this store and reset the store.

    @returns {SC.Store} receiver
  */
  discardChanges: function() {
    // any locked records whose rev or lock rev differs from parent need to
    // be notified.
    var records, locks;
    if ((records = this.records) && (locks = this.locks)) {
      var pstore = get(this, 'parentStore'), psRevisions = pstore.revisions;
      var revisions = this.revisions, storeKey, lock, rev;
      for (storeKey in records) {
        if (!records.hasOwnProperty(storeKey)) continue ;
        if (!(lock = locks[storeKey])) continue; // not locked.

        rev = psRevisions[storeKey];
        if ((rev !== lock) || (revisions[storeKey] > rev)) {
          this._notifyRecordPropertyChange(parseInt(storeKey, 10));
        }
      }
    }

    this.reset();
    this.flush();
    return this ;
  },

  /**
    When you are finished working with a chained store, call this method to
    tear it down.  This will also discard any pending changes.

    @returns {SC.Store} receiver
  */
  destroy: function() {
    this.discardChanges();

    var parentStore = get(this, 'parentStore');
    if (parentStore) parentStore.willDestroyNestedStore(this);

    this._super();
    return this ;
  },

  /**
    Resets a store's data hash contents to match its parent.
  */
  reset: function() {
    var nRecords, nr, sk;
    // requires a pstore to reset
    var parentStore = get(this, 'parentStore');
    if (!parentStore) throw SC.Store.NO_PARENT_STORE_ERROR;

    // inherit data store from parent store.
    this.dataHashes = o_create(parentStore.dataHashes);
    this.revisions  = o_create(parentStore.revisions);
    this.statuses   = o_create(parentStore.statuses);

    // beget nested records references
    this.childRecords = parentStore.childRecords ? o_create(parentStore.childRecords) : {};
    this.parentRecords = parentStore.parentRecords ? o_create(parentStore.parentRecords) : {};

    // also, reset private temporary objects
    this.chainedChanges = this.locks = this.editables = null;
    this.changelog = null ;

    // TODO: Notify record instances
    set(this, 'hasChanges', NO);
  },

  /** @private

    Chain to parentstore
  */
  refreshQuery: function(query) {
    var parentStore = get(this, 'parentStore');
    if (parentStore) parentStore.refreshQuery(query);
    return this ;
  },

  /**
    Returns the `SC.StoreError` object associated with a specific record.

    Delegates the call to the parent store.

    @param {Number} storeKey The store key of the record.

    @returns {SC.StoreError} SC.StoreError or null if no error associated with the record.
  */
  readError: function(storeKey) {
    var parentStore = get(this, 'parentStore');
    return parentStore ? parentStore.readError(storeKey) : null;
  },

  /**
    Returns the `SC.StoreError` object associated with a specific query.

    Delegates the call to the parent store.

    @param {SC.Query} query The SC.Query with which the error is associated.

    @returns {SC.StoreError} SC.StoreError or null if no error associated with the query.
  */
  readQueryError: function(query) {
    var parentStore = get(this, 'parentStore');
    return parentStore ? parentStore.readQueryError(query) : null;
  },

  // ..........................................................
  // CORE ATTRIBUTE API
  //
  // The methods in this layer work on data hashes in the store.  They do not
  // perform any changes that can impact records.  Usually you will not need
  // to use these methods.

  /**
    Returns the current edit status of a storekey.  May be one of `INHERITED`,
    `EDITABLE`, and `LOCKED`.  Used mostly for unit testing.

    @param {Number} storeKey the store key
    @returns {Number} edit status
  */
  storeKeyEditState: function(storeKey) {
    var editables = this.editables, locks = this.locks;
    return (editables && editables[storeKey]) ? SC.Store.EDITABLE : (locks && locks[storeKey]) ? SC.Store.LOCKED : SC.Store.INHERITED ;
  },

  /**  @private
    Locks the data hash so that it iterates independently from the parent
    store.
  */
  _lock: function(storeKey) {
    var locks = this.locks, rev, editables,
        pk, pr, path, tup, obj, key;

    // already locked -- nothing to do
    if (locks && locks[storeKey]) return this;

    // create locks if needed
    if (!locks) locks = this.locks = [];

    // fixup editables
    editables = this.editables;
    if (editables) editables[storeKey] = 0;


    // if the data hash in the parent store is editable, then clone the hash
    // for our own use.  Otherwise, just copy a reference to the data hash
    // in the parent store. -- find first non-inherited state
    var pstore = get(this, 'parentStore'), editState;
    while(pstore && (editState=pstore.storeKeyEditState(storeKey)) === SC.Store.INHERITED) {
      pstore = get(pstore, 'parentStore');
    }

    if (pstore && editState === SC.Store.EDITABLE) {

      pk = this.childRecords[storeKey];
      if (pk){
        // Since this is a nested record we have to actually walk up the
        // parent chain to get to the root parent and clone that hash. And
        // then reconstruct the memory space linking.
        this._lock(pk);
        pr = this.parentRecords[pk];
        if (pr) {
          path = pr[storeKey];
          this.dataHashes[storeKey] = path ? SC.getPath(this.dataHashes[pk], path) : null;
        }
      }
      else {
        this.dataHashes[storeKey] = SC.copy(pstore.dataHashes[storeKey], YES);
      }
      if (!editables) editables = this.editables = [];
      editables[storeKey] = 1 ; // mark as editable

    } else this.dataHashes[storeKey] = this.dataHashes[storeKey];

    // also copy the status + revision
    this.statuses[storeKey] = this.statuses[storeKey];
    rev = this.revisions[storeKey] = this.revisions[storeKey];

    // save a lock and make it not editable
    locks[storeKey] = rev || 1;

    return this ;
  },

  /** @private - adds chaining support */
  readDataHash: function(storeKey) {
    if (get(this, 'lockOnRead')) this._lock(storeKey);
    return this.dataHashes[storeKey];
  },

  /** @private - adds chaining support */
  readEditableDataHash: function(storeKey) {

    // lock the data hash if needed
    this._lock(storeKey);

    return this._super(storeKey);
  },

  /** @private - adds chaining support -
    Does not call sc_super because the implementation of the method vary too
    much.
  */
  writeDataHash: function(storeKey, hash, status) {
    var locks = this.locks, didLock = NO, rev ;

    // Update our dataHash and/or status, depending on what was passed in.
    // Note that if no new hash was passed in, we'll lock the storeKey to
    // properly fork our dataHash from our parent store.  Similarly, if no
    // status was passed in, we'll save our own copy of the value.
    if (hash) {
      this.dataHashes[storeKey] = hash;
    }
    else {
      this._lock(storeKey);
      didLock = YES;
    }

    if (status) {
      this.statuses[storeKey] = status;
    }
    else {
      if (!didLock) this.statuses[storeKey] = (this.statuses[storeKey] || SC.Record.READY_NEW);
    }

    if (!didLock) {
      rev = this.revisions[storeKey] = this.revisions[storeKey]; // copy ref

      // make sure we lock if needed.
      if (!locks) locks = this.locks = [];
      if (!locks[storeKey]) locks[storeKey] = rev || 1;
    }

    // Also note that this hash is now editable.  (Even if we locked it,
    // above, it may not have been marked as editable.)
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    editables[storeKey] = 1 ; // use number for dense array support

    return this ;
  },

  /** @private - adds chaining support */
  removeDataHash: function(storeKey, status) {

    // record optimistic lock revision
    var locks = this.locks;
    if (!locks) locks = this.locks = [];
    if (!locks[storeKey]) locks[storeKey] = this.revisions[storeKey] || 1;

    return this._super(storeKey, status);
  },

  /** @private - bookkeeping for a single data hash. */
  dataHashDidChange: function(storeKeys, rev, statusOnly, key) {

    // update the revision for storeKey.  Use generateStoreKey() because that
    // gaurantees a universally (to this store hierarchy anyway) unique
    // key value.
    if (!rev) rev = SC.Store.generateStoreKey();
    var isArray, len, idx, storeKey;

    isArray = SC.typeOf(storeKeys) === 'array';
    if (isArray) {
      len = storeKeys.length;
    } else {
      len = 1;
      storeKey = storeKeys;
    }

    var changes = this.chainedChanges;
    if (!changes) changes = this.chainedChanges = SC.Set.create();

    for(idx=0;idx<len;idx++) {
      if (isArray) storeKey = storeKeys[idx];
      this._lock(storeKey);
      this.revisions[storeKey] = rev;
      changes.add(storeKey);
      this._notifyRecordPropertyChange(storeKey, statusOnly, key);
    }

    set(this, 'hasChanges', YES);
    return this ;
  },

  // ..........................................................
  // SYNCING CHANGES
  //

  /** @private - adapt for nested store */
  commitChangesFromNestedStore: function(nestedStore, changes, force) {

    this._super(nestedStore, changes, force);

    // save a lock for each store key if it does not have one already
    // also add each storeKey to my own changes set.
    var pstore = get(this, 'parentStore'), psRevisions = pstore.revisions, i;
    var myLocks = this.locks, myChanges = this.chainedChanges,len,storeKey;
    if (!myLocks) myLocks = this.locks = [];
    if (!myChanges) myChanges = this.chainedChanges = SC.Set.create();

    len = changes.length ;
    for(i=0;i<len;i++) {
      storeKey = changes[i];
      if (!myLocks[storeKey]) myLocks[storeKey] = psRevisions[storeKey]||1;
      myChanges.add(storeKey);
    }

    // Finally, mark store as dirty if we have changes
    set(this, 'hasChanges', get(myChanges, 'length')>0);
    this.flush();

    return this ;
  },

  // ..........................................................
  // HIGH-LEVEL RECORD API
  //


  /** @private - adapt for nested store */
  queryFor: function(recordType, conditions, params) {
    return get(this, 'parentStore').queryFor(recordType, conditions, params);
  },

  /** @private - adapt for nested store */
  findAll: function(recordType, conditions, params, recordArray, _store) {
    if (!_store) _store = this;
    return get(this, 'parentStore').findAll(recordType, conditions, params, recordArray, _store);
  },

  // ..........................................................
  // CORE RECORDS API
  //
  // The methods in this section can be used to manipulate records without
  // actually creating record instances.

  /** @private - adapt for nested store

    Unlike for the main store, for nested stores if isRefresh=YES, we'll throw
    an error if the record is dirty.  We'll otherwise avoid setting our status
    because that can disconnect us from upper and/or lower stores.
  */
  retrieveRecords: function(recordTypes, ids, storeKeys, isRefresh) {
    var pstore = get(this, 'parentStore'), idx, storeKey, newStatus,
      len = (!storeKeys) ? ids.length : storeKeys.length,
      K = SC.Record, status;

    // Is this a refresh?
    if (isRefresh) {
      for(idx=0;idx<len;idx++) {
        storeKey = !storeKeys ? pstore.storeKeyFor(recordTypes, ids[idx]) : storeKeys[idx];
        status   = this.peekStatus(storeKey);

        // We won't allow calling retrieve on a dirty record in a nested store
        // (although we do allow it in the main store).  This is because doing
        // so would involve writing a unique status, and that would break the
        // status hierarchy, so even though lower stores would complete the
        // retrieval, the upper layers would never inherit the new statuses.
        if (status & K.DIRTY) {
          throw SC.Store.NESTED_STORE_RETRIEVE_DIRTY_ERROR;
        }
        else {
          // Not dirty?  Then abandon any status we had set (to re-establish
          // any prototype linkage breakage) before asking our parent store to
          // perform the retrieve.
          var dataHashes = this.dataHashes,
              revisions  = this.revisions,
              statuses   = this.statuses,
              editables  = this.editables,
              locks      = this.locks;

          var changed    = NO;
          var statusOnly = NO;

          if (dataHashes  &&  dataHashes.hasOwnProperty(storeKey)) {
            delete dataHashes[storeKey];
            changed = YES;
          }
          if (revisions   &&  revisions.hasOwnProperty(storeKey)) {
            delete revisions[storeKey];
            changed = YES;
          }
          if (editables) delete editables[storeKey];
          if (locks) delete locks[storeKey];

          if (statuses  &&  statuses.hasOwnProperty(storeKey)) {
            delete statuses[storeKey];
            if (!changed) statusOnly = YES;
            changed = YES;
          }

          if (changed) this._notifyRecordPropertyChange(storeKey, statusOnly);
        }
      }
    }

    return pstore.retrieveRecords(recordTypes, ids, storeKeys, isRefresh);
  },

  /** @private - adapt for nested store */
  commitRecords: function(recordTypes, ids, storeKeys) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  commitRecord: function(recordType, id, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  cancelRecords: function(recordTypes, ids, storeKeys) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  cancelRecord: function(recordType, id, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  // ..........................................................
  // DATA SOURCE CALLBACKS
  //
  // Mathods called by the data source on the store

  /** @private - adapt for nested store */
  dataSourceDidCancel: function(storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  dataSourceDidComplete: function(storeKey, dataHash, newId) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  dataSourceDidDestroy: function(storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  dataSourceDidError: function(storeKey, error) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  // ..........................................................
  // PUSH CHANGES FROM DATA SOURCE
  //

  /** @private - adapt for nested store */
  pushRetrieve: function(recordType, id, dataHash, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  pushDestroy: function(recordType, id, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  pushError: function(recordType, id, error, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  }

}) ;


})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore DataStore
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================








})({});


(function(exports) {
// ==========================================================================
// Project:   SproutCore DataStore
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================




})({});

