package com.adarshr.buildtimeline

import hudson.tasks.BuildTrigger
import jenkins.model.Jenkins
import org.junit.Rule
import org.jvnet.hudson.test.JenkinsRule
import spock.lang.Specification

class BuildTimelineViewSpec extends Specification {

    @Rule
    JenkinsRule rule

    def "get timeline data"() {
        given:
            def parent = rule.createFreeStyleProject('parent')
            def child = rule.createFreeStyleProject('child')

            parent.publishersList << new BuildTrigger([child], null)

            Jenkins.instance.rebuildDependencyGraph()

            rule.buildAndAssertSuccess(parent)
            rule.buildAndAssertSuccess(child)

            BuildTimelineView view = new BuildTimelineView('build-timeline-view', 'parent')

        expect:
            view.timelineData == ''
    }
}
