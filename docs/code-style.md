# Travis Coding Style Guide

Some of this is taken from Chris' code style guide (https://github.com/chneukirchen/styleguide/blob/master/RUBY-STYLE)
but heavily modified and extended.

## Propositions

* Readability is mandatory.
* Terseness is requested.
* Vertical space is precious.
* Consistency is valuable.
* Where rules conflict then balance and aestetics are king.
* Documentation is desirable for understanding the allover picture.

There's not much to be said about readability. Every Ruby programmer will know.
Still readability has to be balanced with terseness sometimes.

We want to see as many lines of code on one screen. As screens these days are
often much more wide then high vertical space is the most precious space. Still
vertical space has to be balanced with logical grouping sometimes (so we might
add empty lines inside of long methods.)

Just as we use our muscle memory when typing mental pattern recognition helps
us understand something about the code in front of us from a single glimpse.
The more consistent code is structured and style the easier it is for us to
recognize patterns.

We usually want to try using as few characters as possible but abreviations are
a no-go most of the time. Making variable names depend on their context is fine
(e.g. name instead of user\_name inside of User).

Still for almost any coding style rule there is an exception. Often times goals
conflict (such as vertical space vs documentation) so there are tradeoffs, we
need to find a balance and can't achieve all of the goals at once.

## Formatting

### Spaces around syntax chars

Use spaces around operators, after commas, colons and semicolons, around { and
before }.

    a, b = 1 + 2, 3 * 4

    case foo; when 1: bar; end

    foo { bar }

Avoid using semicolons if possible. Use a new line.

### No spaces inside of parantheses and brackets.

Do not use a space after (, [ and before ], ).

    foo(1, 2)
    [1, 2]

### Indentation of when, else, rescue, end

For if, case and begin blocks indent when, else, elsif, rescue and end as deep
as the first char on the block's first line.

    case foo
    when 1: bar
    end

    a = case foo
    when 1
      bar
    end

    # same for if/else/elsif/end and begin/rescue/end

### Indentation of public, protected, private blocks

TBD

### Document wisely

Use RDoc and its conventions for API documentation.  Don't put an empty or
commented empty line between the comment block and the def.

Generally modules and classes should have a highlevel documentation explaining
their purpose in the overall architecture. Public methods should have a
documentation unless their purpose is very clear. Protected and private methods
only should have documentation if their purpose very obscure from reading the
code.

Comments inside of method definitions should usually be avoided unless
some exception really needs to be explained. If so the comment should be at the
end of the line if possible.

    a =~ /weird regexp/ # briefly explain what it does

### Break up long sections into logical paragraphs

If we have a very long classe or module we'll probably want to extract a class
or module. If we have a very long method it probably should be broken up to
many short methods.

Where this is not possible (or was deferred) we can break them up into sections
by adding a single empty line. We might also add a single comment line naming
the section in classes and modules.

### Try keeping lines shorter than 80 characters

We should try hard keeping lines short for readability. But we also should try
hard to use as little vertical space as possible. Where these goals conflict we
might exceed 80 chars.

### Avoid trailing whitespace

Trailing whitespace can become very annoying as soon as more than one person
works on the code as it can cause unnecessary conflicts when some people's
editors strip whitespace while other's don't. There's good support for removing
trailing whitespace for all editors, so you should use it.



# TBD


== Syntax:

* Use def with parentheses when there are arguments.

* Never use for, unless you exactly know why.

* Never use then.

* Use when x; ... for one-line cases.

* Use &&/|| for boolean expressions, and/or for control flow.  (Rule
  of thumb: If you have to use outer parentheses, you are using the
  wrong operators.)

* Avoid multiline ?:, use if.

* Suppress superfluous parentheses when calling methods, but keep them
  when calling "functions", i.e. when you use the return value in the
  same line.

    x = Math.sin(y)
    array.delete e

* Prefer {...} over do...end.  Multiline {...} is fine: having
  different statement endings (} for blocks, end for if/while/...)
  makes it easier to see what ends where.  But use do...end for
  "control flow" and "method definitions" (e.g. in Rakefiles and
  certain DSLs.)  Avoid do...end when chaining.

* Avoid return where not required.

* Avoid line continuation (\) where not required.

* Using the return value of = is okay:

    if v = array.grep(/foo/) ...

* Use ||= freely.

* Use non-OO regexps (they won't make the code better).  Freely use
  =~, $0-9, $~, $` and $' when needed.


== Naming:

* Use snake_case for methods.

* Use CamelCase for classes and modules.  (Keep acronyms like HTTP,
  RFC, XML uppercase.)

* Use SCREAMING_SNAKE_CASE for other constants.

* The length of an identifier determines its scope.  Use one-letter
  variables for short block/method parameters, according to this
  scheme:

    a,b,c: any object
    d: directory names
    e: elements of an Enumerable
    ex: rescued exceptions
    f: files and file names
    i,j: indexes
    k: the key part of a hash entry
    m: methods
    o: any object
    r: return values of short methods
    s: strings
    v: any value
    v: the value part of a hash entry
    x,y,z: numbers

  And in general, the first letter of the class name if all objects
  are of that type.

* Use _ or names prefixed with _ for unused variables.

* When using inject with short blocks, name the arguments |a, e|
  (mnemonic: accumulator, element)

* When defining binary operators, name the argument "other".

* Prefer map over collect, find over detect, find_all over select,
  size over length.


== Comments:

* Comments longer than a word are capitalized and use punctuation.
  Use two spaces after periods.

* Avoid superfluous comments.


== The rest:

* Write ruby -w safe code.

* Avoid hashes-as-optional-parameters.  Does the method do too much?

* Avoid long methods.

* Avoid long parameter lists.

* Use def self.method to define singleton methods.

* Add "global" methods to Kernel (if you have to) and make them private.

* Avoid alias when alias_method will do.

* Use OptionParser for parsing complex command line options and
  ruby -s for trivial command line options.

* Write for 1.8, but avoid doing things you know that will break in 1.9.

* Avoid needless metaprogramming.


== General:

* Code in a functional way, avoid mutation when it makes sense.

* Do not mutate arguments unless that is the purpose of the method.

* Do not mess around in core classes when writing libraries.

* Do not program defensively.
  (See http://www.erlang.se/doc/programming_rules.shtml#HDR11.)

* Keep the code simple.

* Don't overdesign.

* Don't underdesign.

* Avoid bugs.

* Read other style guides and apply the parts that don't dissent with
  this list.

* Be consistent.

* Use common sense.

== Editor:

* Use ASCII (or UTF-8, if you have to).
* Use 2 space indent, no tabs.
* Use Unix-style line endings.


