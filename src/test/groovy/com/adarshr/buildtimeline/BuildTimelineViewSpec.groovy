package com.adarshr.buildtimeline

import groovy.json.JsonSlurper
import hudson.model.Result
import hudson.tasks.BuildTrigger
import jenkins.model.Jenkins
import org.junit.Rule
import org.jvnet.hudson.test.JenkinsRule
import spock.lang.Specification

class BuildTimelineViewSpec extends Specification {

    @Rule
    JenkinsRule rule

    BuildTimelineView view = new BuildTimelineView('build-timeline-view', 'parent')

    def "get timeline data"() {
        given:
            def parent = rule.createFreeStyleProject('parent')
            def child = rule.createFreeStyleProject('child')
            parent.publishersList.add(new BuildTrigger([child], Result.SUCCESS))
            Jenkins.instance.rebuildDependencyGraph()

            rule.buildAndAssertSuccess(parent)
            rule.waitUntilNoActivity()

        when:
            String json = view.timelineData

        then:
            List data = new JsonSlurper().parseText(json) as List
            data[0].name == 'parent'
            data[0].start > 0
            data[0].end > data[0].start
            data[0].status == 'success'
            data[1].name == 'child'
            data[1].start > data[0].end
            data[1].end > data[1].start
            data[1].status == 'success'
    }

    def "get timeline data when no downstream projects exist"() {
        given:
            def parent = rule.createFreeStyleProject('parent')
            rule.buildAndAssertSuccess(parent)
            rule.waitUntilNoActivity()

        when:
            String json = view.timelineData

        then:
            List data = new JsonSlurper().parseText(json) as List
            data[0].name == 'parent'
            data[0].start > 0
            data[0].end > data[0].start
            data.size() == 1
    }

    def "get timeline data when a downstream job is manually triggered"() {
        given:
            def parent = rule.createFreeStyleProject('parent')
            def child = rule.createFreeStyleProject('child')
            parent.publishersList.add(new BuildTrigger([child], Result.SUCCESS))
            Jenkins.instance.rebuildDependencyGraph()

            rule.buildAndAssertSuccess(parent)
            rule.waitUntilNoActivity()
            rule.buildAndAssertSuccess(child)
            rule.waitUntilNoActivity()

        when:
            String json = view.timelineData

        then:
            List data = new JsonSlurper().parseText(json) as List
            data[0].name == 'parent'
            data[0].start > 0
            data[0].end > data[0].start
            data[1].name == 'child'
            data[1].start > data[0].end
            data[1].end > data[1].start
    }
}
