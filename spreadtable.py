import cgi
import wsgiref.handlers
import os
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext import db


class MainPage(webapp.RequestHandler):
  def get(self):
    template_values = {
      'url': 'hello',
      'url_linktext': 'test',
      }

    path = os.path.join(os.path.dirname(__file__), 'index.htm')
    self.response.out.write(template.render(path, template_values))

def main():
  application = webapp.WSGIApplication(
                                       [('/', MainPage)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)

if __name__ == "__main__":
  main()
