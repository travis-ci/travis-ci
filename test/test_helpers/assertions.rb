module TestHelpers
  module Assertions
    def assert_flunks(message)
      _wrap_assertion do
        exception = nil

        begin
          yield
        rescue Exception => e
          exception = e
        end

        if exception.nil?
          flunk("expected <Test::Unit::AssertionFailedError #{message}> to be raised but nothing was raised.")
        elsif !exception.is_a?(Test::Unit::AssertionFailedError) || (message != exception.message)
          flunk("expected #<Test::Unit::AssertionFailedError: #{message.inspect}> to be raised but raised #<#{exception.class}: #{exception.message.inspect}>.")
        end
      end
    end

    def assert_equal_hashes(expected, actual)
      diff = lambda do |lft_hash, rgt_hash, stack|
        result = lft_hash.inject([]) do |result, (key, lft)|
          stack << key
          rgt = rgt_hash[key] rescue nil
          if lft.is_a?(Hash) && rgt.is_a?(Hash)
            result += diff.call(lft, rgt, stack)
          elsif lft != rgt
            result << [lft, rgt, stack.dup]
          end
          stack.pop
          result
        end
        result
      end

      format = lambda do |data|
        lft, rgt, stack = *data
        "Expected #{stack.inject(['actual']) { |result, key| result << "[#{key.inspect}]" }} to be: #{lft.inspect} but was: #{rgt.inspect}" if stack
      end
      revert = lambda do |data|
        lft, rgt, stack = *data
        [rgt, lft, stack]
      end

      messages  = diff.call(expected, actual, []).map(&format)
      messages += diff.call(actual, expected, []).map(&revert).map(&format)
      messages  = messages.uniq.compact

      defined?(MiniTest) ? self._assertions += 1 : add_assertion
      flunk(messages.join("\n")) unless messages.empty?
    end
  end
end

if __FILE__ == $0
  require 'test/unit'
  require 'assertions/assert_flunks'

  class AssertEqualHashTest < Test::Unit::TestCase
    include TestHelpers::Assertions

    def test_identical_hashes
      expected = { 1 => 2 }
      actual   = { 1 => 2 }
      assert_nothing_raised { assert_equal_hashes(expected, actual) }
    end

    def test_identical_nested_hashes
      expected = { 1 => { 2 => 3 } }
      actual   = { 1 => { 2 => 3 } }
      assert_nothing_raised { assert_equal_hashes(expected, actual) }
    end

    def test_hashes_differ
      expected = { 1 => 2 }
      actual   = { 1 => 3 }
      message  = "Expected actual[1] to be: 2 but was: 3."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end

    def test_nested_hashes_differ
      expected = { 1 => { 2 => 3 } }
      actual   = { 1 => { 2 => 4 } }
      message  = "Expected actual[1][2] to be: 3 but was: 4."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end

    def test_nested_hashes_differ_missing_left_inner_value
      expected = { 1 => {} }
      actual   = { 1 => { 2 => 3 } }
      message  = "Expected actual[1][2] to be: nil but was: 3."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end

    def test_nested_hashes_differ_missing_left_outer_value
      expected = {}
      actual   = { 1 => { 2 => 3 } }
      message  = "Expected actual[1] to be: nil but was: {2=>3}."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end

    def test_nested_hashes_differ_missing_right_inner_value
      expected = { 1 => { 2 => 3 } }
      actual   = { 1 => {} }
      message  = "Expected actual[1][2] to be: 3 but was: nil."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end

    def test_nested_hashes_differ_missing_right_outer_value
      expected = { 1 => { 2 => 3 } }
      actual   = {}
      message  = "Expected actual[1] to be: {2=>3} but was: nil."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end

    def test_nested_hashes_differ_by_multiple_values
      expected = { 1 => { 2 => 3 }, 4 => { 5 => 6 } }
      actual   = { 1 => { 2 => 4 }, 4 => { 5 => 7 } }
      message  = "Expected actual[1][2] to be: 3 but was: 4\nExpected actual[4][5] to be: 6 but was: 7."
      assert_flunks(message) { assert_equal_hashes(expected, actual) }
    end
  end
end
