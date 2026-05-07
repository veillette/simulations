var bs = function(arr, search, comparitor) {
  if (!arr) return -1;
  if (arr.length === undefined) return -1;
  if (!comparitor) comparitor = bs._defaultComparitor();
  return _bs(arr, search, comparitor);
};

bs.first = function(arr, search, comparitor) {
  return bs.closest(arr, search, {exists: true}, comparitor);
};

bs.last = function(arr, search, comparitor) {
  return bs.closest(arr, search, {exists: true, end: true}, comparitor);
};

bs.closest = function(arr, search, opts, comparitor) {
  if (typeof opts === 'function') {
    comparitor = opts;
    opts = {};
  }
  if (arr.length === 0) return -1;
  if (arr.length === 1) return 0;
  opts = opts || {};
  if (!comparitor) comparitor = bs._defaultComparitor();

  var closest = bsclosest(arr, search, comparitor, opts.end, opts.exists ? false : true);
  if (closest > arr.length - 1) closest = arr.length - 1;
  else if (closest < 0) closest = 0;
  return closest;
};

bs.insert = function(arr, search, opts, comparitor) {
  if (typeof opts === 'function') {
    comparitor = opts;
    opts = {};
  }
  opts = opts || {};
  if (!comparitor) comparitor = bs._defaultComparitor();
  if (!arr.length) {
    arr[0] = search;
    return 0;
  }
  var closest = bs.closest(arr, search, comparitor);
  var cmp = comparitor(arr[closest], search);
  if (cmp < 0) {
    arr.splice(++closest, 0, search);
  } else if (cmp > 0) {
    arr.splice(closest, 0, search);
  } else {
    if (opts.unique) {
      arr[closest] = search;
    } else {
      while (comparitor(arr[closest], search) === 0) {
        if (closest >= arr.length - 1) break;
        closest++;
      }
      arr.splice(closest, 0, search);
    }
  }
  return closest;
};

bs.range = function(arr, from, to, comparitor) {
  if (!comparitor) comparitor = bs._defaultComparitor();
  var fromi = bs.closest(arr, from, comparitor);
  var toi = bs.closest(arr, to, {end: true}, comparitor);
  while (fromi <= toi) {
    if (comparitor(arr[fromi], from) > -1) break;
    fromi++;
  }
  while (toi >= fromi) {
    if (comparitor(arr[toi], to) < 1) break;
    toi--;
  }
  return [fromi, toi];
};

bs.rangeValue = function(arr, from, to, comparitor) {
  var range = bs.range(arr, from, to, comparitor);
  return arr.slice(range[0], range[1] + 1);
};

bs.indexObject = function(o, extractor) {
  var index = [];
  Object.keys(o).forEach(function(k) {
    index.push({k: k, v: extractor(o[k])});
  });
  return index.sort(function(o1, o2) {
    return o1.v - o2.v;
  });
};

bs.cmp = function(v1, v2) {
  return v1 - v2;
};

bs._defaultComparitor = function() {
  var indexMode, indexModeSearch;
  return function(v, search) {
    if (indexMode === undefined) {
      if (typeof v === 'object' && v.hasOwnProperty('v')) indexMode = true;
      if (typeof search === 'object' && search.hasOwnProperty('v')) indexModeSearch = true;
    }
    if (indexMode) v = v.v;
    if (indexModeSearch) search = search.v;
    return v - search;
  };
};

bs._binarySearch = _bs;
bs._binarySearchClosest = bsclosest;

function _bs(arr, search, comparitor) {
  var max = arr.length - 1, min = 0, middle, cmp;
  while (max >= min) {
    middle = mid(min, max);
    cmp = comparitor(arr[middle], search, middle);
    if (cmp < 0) {
      min = middle + 1;
    } else if (cmp > 0) {
      max = middle - 1;
    } else {
      return middle;
    }
  }
  return -1;
}

function bsclosest(arr, search, comparitor, invert, closest) {
  var mids = {}, min = 0, max = arr.length - 1, middle, cmp, sanity = arr.length;
  while (min < max) {
    middle = midCareful(min, max, mids);
    cmp = comparitor(arr[middle], search, middle);
    if (invert) {
      if (cmp > 0) max = middle - 1;
      else min = middle;
    } else {
      if (cmp < 0) min = middle + 1;
      else max = middle;
    }
    if (!--sanity) break;
  }
  if (max == min && comparitor(arr[min], search) === 0) return min;
  if (closest) {
    var match = comparitor(arr[min], search);
    if (min == arr.length - 1 && match < 0) return min;
    if (min == 0 && match > 0) return 0;
    return closest ? (invert ? min + 1 : min - 1) : -1;
  }
  return -1;
}

function mid(v1, v2) {
  return v1 + Math.floor((v2 - v1) / 2);
}

function midCareful(v1, v2, mids) {
  var m = v1 + Math.floor((v2 - v1) / 2);
  if (mids[m]) m = v1 + Math.ceil((v2 - v1) / 2);
  mids[m] = 1;
  return m;
}

export default bs;
