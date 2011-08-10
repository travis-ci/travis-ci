module Support
  module Client
    def with_scope(locator)
      locator ? within(locator) { yield } : yield
    end

    def should_see_text(text)
      wait_until do
        find :xpath, "//*[contains(text(), '#{text}')]"
      end
    end

    def should_not_see_text(text)
      page.should have_no_content(text)
    end

    def dispatch_pusher_command(channel, command, params)
      page.evaluate_script("trigger('#{channel}', '#{command}', '#{params.to_json}' )")
    end
  end
end
