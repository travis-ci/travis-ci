module Support
  module Client
    def with_scope(locator)
      locator ? within(locator) { yield } : yield
    end

    def should_see_text(text, options = {})
      with_scope(options[:within]) do
        wait_until do
          find :xpath, "//*[contains(text(), '#{text}')]" # why don't we use have_content(text) here?
        end
      end
    end
    alias :should_see :should_see_text

    def should_not_see_text(text, options = {})
      with_scope(options[:within]) do
        page.should have_no_content(text)
      end
    end
    alias :should_not_see :should_not_see_text

    def dispatch_pusher_command(channel, command, params)
      page.evaluate_script("trigger('#{channel}', '#{command}', '#{params.to_json}' )")
    end
  end
end
